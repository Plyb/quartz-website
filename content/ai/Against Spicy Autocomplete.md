---
date: 2026-03-31
title: You're Probably Imagining AI Wrong (Against "Spicy Autocomplete", "Stochastic Parrots", and the rest)
---
**Intended Audience**: general public that is somewhat technically literate, but hasn't dived deep into LLMs
___
I often hear AI described as "spicy autocomplete", a "stochastic parrot", "mathy maths", or "just predicting the next word/token." These descriptions are misleading at best, and outright wrong at worst, depending on how you interpret them. Having an inaccurate mental model of AI can lead to worse outcomes when trying (or not trying) to use AI, as well as bad predictions of the future. Hopefully after reading this, you'll have a better understanding of what AI can and can't do and how they work.

> [!NOTE]
> If you've read [When "technically true" becomes "actually misleading"](https://www.theargumentmag.com/p/when-technically-true-becomes-actually) you may see some similar ideas here. It's a good article! You should go and read it. My hope here is to dive a bit more into the technical details of why I believe AI is more than just "spicy autocorrect," hopefully in a way that is accessible to a general audience.

# What is "Spicy Autocorrect"?

As far as I understand, when people refer to LLMs[^1] as "spicy autocomplete," they're referring to two things:
1. LLMs are, fundamentally, a machine that takes in some text and selects[^3] a bit of text[^2] that comes next, sticks that on the end, and repeats. This is the core of how ChatGPT and all the others actually write things, by choosing one bit of text at a time. When people say "AI is just predicting the next word/token," this is what they mean. This was true in the early days of LLMs, and it is true (but [[#How Does Modern AI Work?|misleading!]]) today.
2. In the olden days, LLMs were trained to select the next bit of text by feeding it a huge amount text from the internet and having it predict what comes next. After seeing enough examples and having enough tiny tweaks in the right direction, they could get pretty good at this. But if they stopped there, they wouldn't be nearly as powerful as they are today. Modern AI is doing much more than predicting likely internet text.
Ultimately, though, terms like "spicy autocorrect", "stochastic parrots", and "mathy math" are used to imply that not only are LLMs not "intelligent", but that it's ridiculous to think that they even *could* be.
# How Does Modern AI Work?

While ChatGPT is still just generating text one bit at a time, how it selects that text has changed since the early days of LLMs. It starts in the same place, but there is more going on these days.
## The Training Process

LLMs are "trained", which for our purposes here, just means that we allow the AI to try to accomplish some task, see how well it did, and automatically adjust it accordingly. By doing this over and over, the AI gets incrementally better at the task. While the big companies don't tell us exactly what they do to train their AIs, we know that the core process looks something like the following:
1. Train it to speak English[^5] (and in the process, teach it some things about how the world works)
2. Train it to produce text that looks like a conversation between a human and a chatbot
3. Train it to produce text that is "good" according to different measurements

### Training AI to Speak English (and About the World)

This is the step that has been around since the beginning. In this step, the AI is given huge amounts of text from the internet and tasked with predicting the next snippet. The result is an "AI" that can speak English, but just continues with something similar to whatever you prompted it with. If you ask it a question, it might just keep asking more questions. If you ask it to do something, it might interpret that as the last half of a sentence in some paragraph from a random internet article about that thing. In other words, it's not very useful.

However, even at this stage, we can start to see some hints of something more than just fancy statistics. This comes down to the fact that predicting what comes next is actually harder than it might sound at first. For instance, Llama 3.1 8B is an AI that hasn't been trained on anything except this initial "what comes next" task. If I prompt Llama with "I have a white shirt. I put green dye on it. The shirt is now", it generates "a light green color." It's pretty unlikely that the AI ever saw a sentence exactly like that during training,[^4] but it *has* learned that green on white makes light green and that the colors would mix in this situation.

The general point here is that in order to predict what text comes next, it's really helpful to have an understanding of how the world works, because language is usually referring to things in the real world. AI is not perfect at this. It does not know *everything* about how the world works, but it does seem to learn *some* things about the world just by predicting what comes next.

### Training AI to Have a Conversation

After training the AI to predict what text comes next, we want to tweak our model so that it specifically predicts that the text is part of a conversation between a human and a helpful AI chatbot. Once you already know English, learning how to respond like an assistant is relatively easy, so we need only a tiny fraction of the training examples for this step. After we're done, you can have a conversation with the model by giving it a prompt that looks like

> USER: If I had a white shirt, and I put green dye on it, what color would it end up?
> ASSISTANT:

Under the hood, apps like ChatGPT are doing something similar. They take the text you enter and put it into a format like the above, but fundamentally it is still just predicting what comes next based on the examples it has seen.

### Training AI to Produce "Good" Responses

Once you have an AI that you can have a conversation with, it will respond to your queries, but it might not respond to them *well*. There are a number of things that can go wrong. Maybe the AI is impolite. Maybe it helps you to build a bomb. Maybe it's just really bad at math. This is where the next phase comes in: Reinforcement Learning. In this phase, we have some concept of what a "good" response looks like, and we can tell whether a response is good by reading it. We let the AI have many conversations, while we grade all of its responses, training it to produce more responses like the good ones and less like the bad ones. There are two major ways AI companies do this:

1. Some problems have an easy way to automatically tell if it was solved correctly. If it's a math problem, you either got the right answer or you didn't. If it's programming, you run the program and see if it did the task you wanted it to. In these cases we can easily train the model on a huge amount of problems and see the AI get steadily better at it.
2. Other problems we really care about, such as the AI acting "helpful" or "harmless", but which are hard to measure automatically. For these cases, AI companies rely on human feedback. Sometimes, they collect this feedback through users clicking the thumbs up on a response on their website. Sometimes they hire crowd workers to rate responses. Incidentally, this is part of why most AIs are so overly polite: people rate that highly.

This is where the intuition of AI "just predicting the next bit of text" starts to break down. While it is still technically true that AI trained in this way is producing text one bit at a time, it has been trained to produce text that solves a very different task than predicting internet text.

## AI Can (Theoretically) Do Anything

Another way of approaching AI is to look at what a theoretical, perfect AI could do. An LLM is effectively just a big linear algebra equation, so how much complex reasoning could we expect it to do? Quite a lot actually. But first, we need to understand another part of how modern LLMs respond to your queries.
### Chain-of-Thought

If you've ever had to give a presentation on zero notice, you'll know how hard it can be to come up with something that makes sense on the spot. I don't know about you, but when I have to speak in front of people, I will write down my thoughts beforehand, often going back and editing what I've written previously. If there's a complicated problem I have to solve, I'll put out a white board or a scratch paper to jot ideas down.

A few years ago, AI researcher realized that the same process would probably help AIs to produce better answers. The AI is given a private space where it can generate text that will never be seen by the user, effectively giving it a "scratch pad" to reason through problems. Many modern AI providers (especially at the paid tiers) have their AI "think" on this scratch pad first before responding to your answer. If you've ever seen an AI pause (sometimes with a "thinking..." message or similar) before responding, this is what is happening.

### Turing-Completeness

"Turing-Completeness" is computer-science speak for a machine that can do anything your computer can. Equipped with chain-of-thought[^6], a perfect AI is Turing-complete. If any other computer program can do it, a perfect AI could too, on top of knowing how to speak English.

Now, just because a perfect AI could do it, doesn't mean that real AI can. Your computer can perform any computable process, but someone has to tell it *how* to. In the case of AI, that is what training is for. Although training is imperfect, the point is that there is no *fundamental* reason why the AI couldn't learn to play chess, do your calculus, or program the app.
## We've Seen LLMs Learn Real Algorithms

Saying that an AI can theoretically learn something and demonstrating that it actually *has* are two very different things. Definitively proving an AI has learned an algorithm is very difficult. You may have heard AI referred to as a "black box." We "grow" AIs, we don't "build" them, so even their creators don't necessarily know how they work. However, some small bits of progress have been made at peering into the black box, and researcher have found that for some tasks, LLMs do implement real, generalizable algorithms. In one particularly clear case, an AI trained to do modular addition[^7] learned an algorithm involving a Fourier Transform and several trigonometric identities. To be clear, this AI had never seen a cosine in its life, but it *independently* discovered that they are a useful tool for solving this math problem, and we can see how it uses them using some very clever techniques (see [this excellent video](https://www.youtube.com/watch?v=D8GOeCFFby4) for a description of how).
# But Is AI Actually Intelligent?

It depends on how you define intelligence. I'm less concerned with whether AI is intelligent in some abstract sense of being conscious or having free will. More important is what AI can *do*. It still is far behind human capabilities in plenty of ways, but in others it has already surpassed us. As time goes on, thinking about LLMs as "spicy autocorrect" becomes less and less useful, because that's not how they *behave*.

 I'm not claiming that AI is always doing something intelligent. I'm not claiming that it's going to be a useful tool for you. I'm not claiming that AI is good (in fact I think there are a lot of different reasons to be worried about it). I'm not claiming that it's going to take your job. But I *am* claiming that it is *sometimes* doing something that looks "smart," and it will probably continue to get smarter, at least for a while longer. AI isn't fundamentally limited to predicting what would likely come next on the internet.

LLMs are complicated. No one understands perfectly how they work. But by understanding some of how they are made, what they can do in theory, and what we've proven they can do already, you can start to understand how to use them and what they might be capable of right now and as time goes on.