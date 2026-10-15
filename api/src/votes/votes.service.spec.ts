import { NotFoundException } from '@nestjs/common';
import { VotesService } from './votes.service';

jest.mock('src/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

const createVote = (overrides = {}) => ({
  id: 1,
  characterId: 10,
  userId: 20,
  isEvil: false,
  points: 2,
  createdAt: new Date(),
  ...overrides,
});

describe('VotesService', () => {
  const tx = {
    vote: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    character: {
      update: jest.fn(),
    },
  };
  const prismaService = {
    vote: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(async (callback: (client: typeof tx) => unknown) =>
      callback(tx),
    ),
  };
  const characterService = {
    updateCharacterVoteStats: jest.fn(),
    updateCharacterRatingInfo: jest.fn().mockResolvedValue(undefined),
  };
  let service: VotesService;

  beforeEach(() => {
    jest.clearAllMocks();
    characterService.updateCharacterRatingInfo.mockResolvedValue(undefined);
    service = new VotesService(
      prismaService as never,
      characterService as never,
    );
  });

  describe('createVote', () => {
    it('creates a vote and increments character aggregates', async () => {
      const vote = createVote({ isEvil: true, points: 3 });
      tx.vote.create.mockResolvedValue(vote);
      characterService.updateCharacterVoteStats.mockResolvedValue(undefined);

      await expect(
        service.createVote({
          characterId: 10,
          userId: 20,
          isEvil: true,
          points: 3,
        }),
      ).resolves.toEqual({
        id: vote.id,
        characterId: vote.characterId,
        userId: vote.userId,
        isEvil: vote.isEvil,
        points: vote.points,
      });
      expect(characterService.updateCharacterVoteStats).toHaveBeenCalledWith(
        tx,
        10,
        { totalVotes: 1, evilVotes: 1, points: 3 },
      );
      expect(characterService.updateCharacterRatingInfo).toHaveBeenCalledWith(
        10,
      );
    });
  });

  describe('getVotes', () => {
    it('filters votes and sorts newest first', async () => {
      const votes = [createVote()];
      prismaService.vote.findMany.mockResolvedValue(votes);

      await expect(
        service.getVotes({ characterId: 10, userId: 20, limit: 10 }),
      ).resolves.toEqual([
        {
          id: votes[0].id,
          characterId: votes[0].characterId,
          userId: votes[0].userId,
          isEvil: votes[0].isEvil,
          points: votes[0].points,
        },
      ]);
      expect(prismaService.vote.findMany).toHaveBeenCalledWith({
        where: { characterId: 10, userId: 20 },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
    });
  });

  describe('getVoteById', () => {
    it('returns the requested vote', async () => {
      const vote = createVote();
      prismaService.vote.findUnique.mockResolvedValue(vote);

      await expect(service.getVoteById(1)).resolves.toEqual({
        id: vote.id,
        characterId: vote.characterId,
        userId: vote.userId,
        isEvil: vote.isEvil,
        points: vote.points,
      });
    });

    it('throws when the vote does not exist', async () => {
      prismaService.vote.findUnique.mockResolvedValue(null);

      await expect(service.getVoteById(99)).rejects.toThrow(
        new NotFoundException('Vote with id 99 not found'),
      );
    });
  });

  describe('updateVote', () => {
    it('updates vote values and applies aggregate deltas', async () => {
      const currentVote = {
        id: 1,
        characterId: 10,
        userId: 20,
        isEvil: false,
        points: 1,
      };
      const updatedVote = createVote({ isEvil: true, points: 3 });
      tx.vote.findUnique.mockResolvedValue(currentVote);
      tx.vote.update.mockResolvedValue(updatedVote);
      characterService.updateCharacterVoteStats.mockResolvedValue(undefined);

      await expect(
        service.updateVote(1, { isEvil: true, points: 3 }, 20),
      ).resolves.toEqual({
        id: updatedVote.id,
        characterId: updatedVote.characterId,
        userId: updatedVote.userId,
        isEvil: updatedVote.isEvil,
        points: updatedVote.points,
      });
      expect(characterService.updateCharacterVoteStats).toHaveBeenCalledWith(
        tx,
        10,
        { evilVotes: 1, points: 2 },
      );
      expect(characterService.updateCharacterRatingInfo).toHaveBeenCalledWith(
        10,
      );
    });

    it('throws when the vote does not exist', async () => {
      tx.vote.findUnique.mockResolvedValue(null);

      await expect(service.updateVote(99, { points: 3 }, 20)).rejects.toThrow(
        new NotFoundException('Vote with id 99 not found'),
      );
      expect(tx.vote.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteVote', () => {
    it('deletes the vote and reverses character aggregates', async () => {
      const currentVote = {
        id: 1,
        characterId: 10,
        userId: 20,
        isEvil: true,
        points: 3,
      };
      const deletedVote = createVote({ isEvil: true, points: 3 });
      tx.vote.findUnique.mockResolvedValue(currentVote);
      characterService.updateCharacterVoteStats.mockResolvedValue(undefined);
      tx.vote.delete.mockResolvedValue(deletedVote);

      await expect(service.deleteVote(1, 20)).resolves.toEqual({
        id: deletedVote.id,
        characterId: deletedVote.characterId,
        userId: deletedVote.userId,
        isEvil: deletedVote.isEvil,
        points: deletedVote.points,
      });
      expect(characterService.updateCharacterVoteStats).toHaveBeenCalledWith(
        tx,
        10,
        { totalVotes: -1, evilVotes: -1, points: -3 },
      );
      expect(characterService.updateCharacterRatingInfo).toHaveBeenCalledWith(
        10,
      );
    });

    it('throws when the vote does not exist', async () => {
      tx.vote.findUnique.mockResolvedValue(null);

      await expect(service.deleteVote(99, 20)).rejects.toThrow(
        new NotFoundException('Vote with id 99 not found'),
      );
      expect(tx.vote.delete).not.toHaveBeenCalled();
    });
  });
});
