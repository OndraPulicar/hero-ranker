import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async getRanking(
    name: string,
    totalVotes: number,
    points: number,
    evilVotes: number,
  ) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: `
        You analyze a fictional character called ${name} based on community voting statistics.
        Write a short, engaging English commentary. The commentary will be maximum of 12 words.
        Explain how evil the character is perceived to be
        and how popular the character is.
        Base your conclusions only on the provided statistics.
        Do not invent explanations for why people voted this way.
        Here is the logic behind calculating data from the votes:
        Users cast votes and they can cast 1, 2 or 3 points for the character, 1 meaning very unpopular and 3 meaning very popular. The points are then added from all the users and saved into variable 'points'.
        When casting their vote, they also specify if they think the character is evil. The votes are then added and saved in variable 'evilVotes'.
        'Total votes' is the total count of votes from all users for the character.
        Here are the statistics: ${JSON.stringify({
          evilVotes,
          totalVotes,
          points,
        })}
      `,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.MINIMAL,
        },
      },
    });

    return response.text;
  }
}
