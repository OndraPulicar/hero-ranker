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
    $transaction: jest.fn((callback: (client: typeof tx) => unknown) =>
      callback(tx),
    ),
  };
  let service: VotesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VotesService(prismaService as never);
  });

  describe('createVote', () => {
    it('creates a vote and increments character aggregates', async () => {
      const vote = createVote({ isEvil: true, points: 3 });
      tx.vote.create.mockResolvedValue(vote);
      tx.character.update.mockResolvedValue({});

      await expect(
        service.createVote({
          characterId: 10,
          userId: 20,
          isEvil: true,
          points: 3,
        }),
      ).resolves.toEqual(vote);
      expect(tx.character.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: {
          totalVotes: { increment: 1 },
          evilVotes: { increment: 1 },
          points: { increment: 3 },
        },
      });
    });
  });

  describe('getVotes', () => {
    it('filters votes and sorts newest first', async () => {
      const votes = [createVote()];
      prismaService.vote.findMany.mockResolvedValue(votes);

      await expect(
        service.getVotes({ characterId: 10, userId: 20, limit: 10 }),
      ).resolves.toEqual(votes);
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

      await expect(service.getVoteById(1)).resolves.toEqual(vote);
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
      const currentVote = { characterId: 10, isEvil: false, points: 1 };
      const updatedVote = createVote({ isEvil: true, points: 3 });
      tx.vote.findUnique.mockResolvedValue(currentVote);
      tx.vote.update.mockResolvedValue(updatedVote);
      tx.character.update.mockResolvedValue({});

      await expect(
        service.updateVote(1, { isEvil: true, points: 3 }),
      ).resolves.toEqual(updatedVote);
      expect(tx.character.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: {
          evilVotes: { increment: 1 },
          points: { increment: 2 },
        },
      });
    });

    it('throws when the vote does not exist', async () => {
      tx.vote.findUnique.mockResolvedValue(null);

      await expect(service.updateVote(99, { points: 3 })).rejects.toThrow(
        new NotFoundException('Vote with id 99 not found'),
      );
      expect(tx.vote.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteVote', () => {
    it('deletes the vote and reverses character aggregates', async () => {
      const currentVote = { characterId: 10, isEvil: true, points: 3 };
      const deletedVote = createVote({ isEvil: true, points: 3 });
      tx.vote.findUnique.mockResolvedValue(currentVote);
      tx.character.update.mockResolvedValue({});
      tx.vote.delete.mockResolvedValue(deletedVote);

      await expect(service.deleteVote(1)).resolves.toEqual(deletedVote);
      expect(tx.character.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: {
          totalVotes: { decrement: 1 },
          evilVotes: { decrement: 1 },
          points: { decrement: 3 },
        },
      });
    });

    it('throws when the vote does not exist', async () => {
      tx.vote.findUnique.mockResolvedValue(null);

      await expect(service.deleteVote(99)).rejects.toThrow(
        new NotFoundException('Vote with id 99 not found'),
      );
      expect(tx.vote.delete).not.toHaveBeenCalled();
    });
  });
});
