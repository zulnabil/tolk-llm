# Tolk.js

A zero-dependency CLI tool for chatting with local LLM (Large Language Model) servers.

![](https://github.com/zulnabil/tolk-llm/blob/main/demo.gif)

## Description

Tolk.js is a lightweight command-line interface that allows you to interact with any local LLM server through a simple chat interface. Written in just 130 lines of code, it supports both streaming and non-streaming responses while maintaining chat history for contextual conversations.

## Requirements

- Node.js
- A running LLM server with a chat completions endpoint

## Environment Variables

- `LLM_API_BASE_URL` (required): The base URL of your LLM server
- `LLM_CHAT_MODEL` (required): The model name to use for chat completions
- `DISABLE_STREAM` (optional): Set to any value to disable streaming responses

## Usage

1. Set up your environment variables:
```bash
export LLM_API_BASE_URL=http://localhost:39281/v1
export LLM_CHAT_MODEL=qwen2.5:3b-gguf-q5-km
```

2. Run the script:
```bash
./tolk.js
```

3. Start chatting! Type your messages after the `>>` prompt.

## Example

```bash
$ ./tolk.js
LLM Host: http://localhost:39281/v1
Model: qwen2.5:3b-gguf-q5-km
>> do u know where palu is?
Palu is a city in Indonesia.
>> how many people live there?
According to the latest data, Palu's population was approximately 361,500 as of the 2010 census. Please note that this can change over time and for more recent figures, you should check the most current sources.
>>
```

## Features

- Zero external dependencies
- Supports streaming responses
- Simple and straightforward interface
- Maintains conversation history for contextual chats
- Compatible with any LLM server that implements the chat completions endpoint
- Just 130 lines of code

## License

MIT
