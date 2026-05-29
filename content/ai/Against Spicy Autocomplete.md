---
date: 2026-03-31
title: You're Probably Imagining AI Wrong (Against "Spicy Autocomplete")
---
**Intended Audience**: general public that knows some things about LLMs, but hasn't dived deep into them
___
I often hear AI described as ["spicy autocomplete,"](https://pluralistic.net/2023/11/27/10-types-of-people/#taking-up-a-lot-of-space) a ["stochastic parrot,"](https://dl.acm.org/doi/10.1145/3442188.3445922) ["mathy maths,"](https://www.dair-institute.org/projects/the-ai-con/) or "just predicting the next word/token." Depending on how you interpret them, these descriptions are [misleading at best](https://www.theargumentmag.com/p/when-technically-true-becomes-actually), and outright wrong at worst. I've heard a lot of well-intentioned claims about the limits of AI based on the fact that it is "just predicting the next word," many of which turned out to be wrong. If that is your mental model of AI, you're probably going to keep getting surprised when AI does things that should have been impossible.

> [!NOTE]
> If you've read [When "technically true" becomes "actually misleading"](https://www.theargumentmag.com/p/when-technically-true-becomes-actually) you may see some similar ideas here. It's a good article! You should go and read it. My hope here is to dive a bit more into the technical details of why I believe AI is more than just "spicy autocorrect," hopefully in a way that is accessible to a general audience. I also make fewer claims about what AI is *currently* capable of, and more about what it is *potentially* capable of.

Now, to be clear, I'm not claiming that current AI is good at everything. There are some things it can do shockingly well, but also it often fails at seemingly very simple tasks (this is called the "jagged frontier of capabilities" and is a very useful thing to keep in mind). I'm also not claiming that AI is "intelligent" or that is has "thoughts" in some philosophical sense. What I'm more concerned with is what we think AI is potentially capable of. We should not rule out possibilities based on a misleading idea of what AI is. In other words, while it might be true that AI is currently incompetent, it is *not* true that it *must always* be incompetent.

# What is "Spicy Autocorrect"?

As far as I understand, when people refer to LLMs[^1] as "spicy autocomplete," they're referring to two things:
1. LLMs are, fundamentally, a machine that takes in some text, selects[^2] a bit of text[^3] to come next, sticks that on the end, and repeats. This is the core of how ChatGPT and all the others actually write things, by choosing one bit of text at a time. When people say "AI is just predicting the next word/token," this is what they mean. This was true in the early days of LLMs, and it is still true (but [[#How Does Modern AI Work?|misleading!]]) today.
2. In the olden days, LLMs were trained to select the next bit of text by feeding it a huge amount text from the internet and having it predict what comes next. After seeing enough examples, they could get pretty good at this. But if they stopped there, they wouldn't be nearly as powerful as they are today. Modern AI is doing much more than predicting likely internet text.
Ultimately, though, terms like "spicy autocorrect" are used to imply that not only are LLMs not "intelligent," but that it's ridiculous to think that they even *could* be.
# How Does Modern AI Work?

While ChatGPT is still just generating text one bit at a time, how it selects that text has gotten more complicated since the early days of LLMs. It starts in the same place, but nowadays there is more going on.
## The Training Process

LLMs are "trained," which for our purposes here, just means that we allow the AI to try to accomplish some task, see how well it did, and automatically adjust it accordingly. By doing this over and over, the AI gets incrementally better at the task. While the big companies don't tell us exactly what they do to train their AIs, we know that the core process looks something like the following:
1. Train it to speak English[^4] (and in the process, teach it some things about how the world works)
2. Train it to produce text that looks like a conversation between a human and a chatbot
3. Train it to produce text that is "good" according to different kinds of graders

### Teaching AI to Speak English (and About the World)

This first step has been around since the beginning. The AI is given huge amounts of text from the internet and tasked with predicting the next snippet. The result is an AI that can speak English, but just continues with something similar to whatever you prompted[^5] it with. If you ask it a question, it might just keep asking more questions. If you ask it to do something, it might write a story where somewhat was asked to do that thing. In other words, they aren't very useful as chatbots.

However, even at this stage, we can start to see some hints of something more than just fancy statistics. This comes down to the fact that predicting what comes next is actually harder than it might sound at first. For instance, Llama 3.1 8B[^6] is an AI that hasn't been trained on anything except the "what comes next" task. If I prompt Llama with "I have a white shirt. I put green dye on it. The shirt is now", it generates "a light green color." It's pretty unlikely that the AI ever saw a sentence exactly like that during training,[^7] but it *has* learned that green on white makes light green and that the colors would mix in this situation.

The point here is that in order to predict what text comes next, it's really helpful to have an understanding of how the world works. Language is usually referring to things in the real world, so patterns in the real world translate to patterns in text. AI is not perfect at this. It does not know *everything* about how the world works, but it does seem to learn *some* things about the world just by predicting what comes next.
### Training AI to Have a Conversation

After training the AI to predict what text comes next, we want to tweak our model so that it specifically predicts that the text is part of a conversation between a human and a helpful AI chatbot. Once you already know English, learning how to respond like an assistant is relatively easy, so we need only a tiny fraction of the training examples for this step. After we're done, you can have a conversation with the model by giving it a prompt that looks like

> USER: If I had a white shirt, and I put green dye on it, what color would it end up?
> ASSISTANT:

Under the hood, apps like ChatGPT are doing something similar. They take the text you enter and put it into a format like the above, but fundamentally it is still just predicting what comes next based on the examples it has seen.

### Training AI to Produce "Good" Responses

Even if your AI can have a conversation with you, but it might not respond *well*. There are a number of things that can go wrong. Maybe the AI is impolite. Maybe it helps you plan a bank heist. Maybe it's just really bad at math. This is where the next step comes in: reinforcement learning. In this step, we define some way to grade the responses from the AI. We let the AI have a lot of conversations, grading all of its responses, and we train it to produce more responses like the good ones and less like the bad ones. There are two major ways AI companies do this:

1. Some problems have an easy way to automatically tell if it was solved correctly. If it's a math problem, you either got the right answer or you didn't. If it's programming, you run the program and see if it did the thing you wanted it to. In these cases we can straightforwardly train the model on a huge amount of problems and see the AI get steadily better.
2. There are other attributes that we really care about, such as the AI acting "helpful" or "harmless," but which are hard to measure automatically. For these cases, AI companies rely on human feedback. Sometimes, they collect this feedback through users clicking the thumbs up on a response on their website. Sometimes they hire crowd workers to rate responses. Incidentally, this is part of why most AIs are so overly polite: people rate that highly.

This is where the intuition of AI "just predicting the next bit of text" starts to break down. While it is still technically true that the AI is producing text one bit at a time, it is no longer just "predicting" what comes next based on examples it has seen. It is producing text *directly* to satisfy the grader's concept of a "good" response.

## AI Can (Theoretically) Do Anything

Another way of approaching AI is to look at what a theoretical, perfect LLM could do. An LLM is effectively just a big linear algebra equation, so how much complex reasoning could we expect it to do? Quite a lot actually. But first, we need to understand another part of how modern LLMs respond to your queries.
### Chain-of-Thought

If you've ever had to give a presentation on zero notice, you'll know how hard it can be to come up with something on the spot that makes sense. When I have to speak in front of people, I write down my thoughts beforehand. If there's a complicated problem I have to solve, I'll pull out a white board or a scratch pad to jot ideas down.

A few years ago, [AI researchers](https://arxiv.org/abs/2201.11903) realized that the same process would probably help AIs to produce better answers. The AI is given a private space where it can generate text that will never be seen by the user, effectively giving it a "scratch pad" to reason through problems. Many modern AI providers (especially at the paid tiers) have their AI "think" on this scratch pad first before responding to your answer. If you've ever seen an AI pause (sometimes with a "thinking..." message or similar) before responding, this is what is happening.

What does it write on the scratch pad? In short, whatever helps them produce a better answer. When AIs are trained to use "chain-of-thought," they're given a few examples and then let loose with reinforcement learning. At that point, they will learn to use the scratch pad in whatever way helps it to get a better score from the grader.
### Turing-Completeness

"Turing-Completeness" is computer-science speak for being able to do anything your computer can. Equipped with chain-of-thought[^8] and a perfect training setup, [an LLM is Turing-complete](https://arxiv.org/abs/2411.01992). If any other computer program can do it, a perfect AI could too, on top of knowing how to speak English.
## We've Seen LLMs Learn Real Algorithms

Saying that an AI can theoretically learn something and demonstrating that it actually *has* are two *very* different things. Definitively proving an AI has learned an algorithm is difficult. You may have heard AI referred to as a "black box." We "grow" AIs, we don't "build" them. Even their creators don't necessarily know how they work. However, some small bits of progress *have* been made at peering into the black box. In the process, researcher have found that (at least for some tasks), LLMs do implement real, generalizable algorithms. For example, in one particularly clear case, an AI trained to do modular addition[^9] learned an algorithm involving a Fourier Transform and several trigonometric identities. To be clear, this AI had never seen a cosine in its life, but it *independently* discovered that they are a useful tool for solving this math problem, and we can see how it uses them using some very clever techniques (see [this excellent video](https://www.youtube.com/watch?v=D8GOeCFFby4) for a description of how).
# But Is AI Actually Intelligent?

It depends on what you mean by "intelligent." Is a chess-bot that can beat the best humans intelligent? In some ways yes, in some ways no. The more useful question is asking "what can I expect AI to be able to do?" Both current LLMs, and LLMs that will be developed in the future. By understanding what they are actually trained to do, what their theoretical limits are, and the results we've already seen, you'll be better equipped to know what might come next.

[^1]: LLM = Large Language Model. This is the kind of AI at the heart of apps like ChatGPT, and which I'm talking about in this article.
[^2]: Note that I say "select" here, not "predict". The term prediction comes from the [[#Teaching AI to Speak English (and About the World)|first couple phases of training]], but at it's core, all the LLM is doing is scoring different possibilities for what could come next.
[^3]: These "bits of text" are called "tokens". As a mental model, you can just think of them as words.
[^4]: English or any other natural language, or multiple different languages. "English" is just a useful shorthand.
[^5]: "Prompt" here just means the text that we give to the model as the start and ask it to predict what comes next
[^6]: You can play around with this AI yourself at https://huggingface.co/meta-llama/Llama-3.1-8B. If they haven't removed it, there should be a box with "Your prompt here..." on the side.
[^7]: Any example I give here will be risky for me, because the AI companies don't tell us exactly what data they use to train the model. The internet is a big place. Even if it hasn't seen that exact sentence, maybe it's seen something similar and is doing pattern matching. But at what point does "pattern matching" become "following useful rules"? More convincing evidence of the AI learning about the world comes from the field of "Mechanistic Interpretability." It get's pretty technical and complicated, so I don't include much of it in this article (with the exception of the [[#We've Seen LLMs Learn Real Algorithms|modular addition]] example), but the core idea is that (through a lot of effort), researchers have found that there are recognizable structures inside these AIs that correspond to real world concepts and ideas.
[^8]: They don't technically need chain-of-thought to do this, but it would be really annoying if your AI was using most of its actual response to you for computational purposes.
[^9]: Modular addition is addition like you'd do on a clock: after you get to a certain number, you wrap back around to the beginning. Clock hours can be added modulo 12, so that 8 + 5 = 1.
