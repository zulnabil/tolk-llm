#!/usr/bin/env node

const readline = require('readline')

const LLM_API_BASE_URL = process.env.LLM_API_BASE_URL // required
const LLM_CHAT_MODEL = process.env.LLM_CHAT_MODEL // required
const LLM_API_KEY = process.env.LLM_API_KEY // optional
const DISABLE_STREAM = process.env.DISABLE_STREAM

const print = (text) => process.stdout.write(text)

const chat = async (messages) => {
    const url = `${LLM_API_BASE_URL}/chat/completions`
    
    const body = JSON.stringify({
        model: LLM_CHAT_MODEL,
        messages,
        stream: !DISABLE_STREAM
    })

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 
                ...(LLM_API_KEY && { 'Authorization': `Bearer ${LLM_API_KEY}` })
             },
            body
        })

        const extract = (raw) => {
            const { choices } = raw
            if (choices) {
                return choices[0].message.content.trim()
            }
            return ''
        }

        const parse = (line) => {
            if (line.startsWith('data: ')) {
                const payload = line.substring(6);
                try {
                    const data = JSON.parse(payload);
                    const { choices } = data;
                    const [choice] = choices;
                    const { delta } = choice;
                    return delta?.content;
                } catch (e) {
                    // ignore
                } 
            }
            return null;
        }

        if (DISABLE_STREAM) {
            const data = await response.json()
            return extract(data)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        let answer = '';
        while (true) {
            const { value, done } = await reader.read()

            if (done) break

            const lines = decoder.decode(value).split('\n')
            for (let i=0; i < lines.length; i++) {
                const line = lines[i];
                if (line === 'data: [DONE]') break
                if (line.length) {
                    const content = parse(line.trim());
                    if (content?.length) {
                        if (!answer.length) {
                            answer = content;
                            print(content);
                        } else {
                            answer += content;
                            print(content);
                        }
                    }
                }
            }

        }
        return answer
    } catch(e) {
        console.error(e)
    }
}

const SYSTEM_PROMPT = "Answer the question straight-forwarded and concisely"

const interact = () => {
    console.log(`LLM Host: ${LLM_API_BASE_URL}`)
    console.log(`Model: ${LLM_CHAT_MODEL}`)
    const io = readline.createInterface({input: process.stdin, output: process.stdout})
    let open = true
    io.on('close', () => { open = false; });
    const messages = [
        {
            role: "system",
            content: SYSTEM_PROMPT
        },
       
    ]
    const conversation = () => {
        io.question(">> ", async (content) => {
            messages.push( {
                role: "user",
                content
            })
            const answer = await chat(messages)

            if (DISABLE_STREAM) print(answer)

            messages.push({
                role: 'assistant',
                content: answer
            })
            console.log()
            open && conversation()
        })

    }

    conversation()
}

(() => {
    interact()
})()