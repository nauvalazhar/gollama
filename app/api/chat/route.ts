import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

const model = ollama('llama3.2');
// const model = openai('gpt-4o');

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model,
    messages,
    system: `You are a friendly and helpful AI assistant. Keep your responses:
- Simple and easy to understand 
- Accurate but not overly formal
- Focused on what the user is asking about
- Feel free to ask questions if something's unclear
- Casual and conversational, like chatting with a friend

Don't be afraid to ask follow-up questions to better help the user!`,
  });

  return result.toDataStreamResponse();
}
