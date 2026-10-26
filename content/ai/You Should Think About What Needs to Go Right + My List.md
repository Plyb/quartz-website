---
title: You Should Think About What Needs to Go Right + My List
date: 2026-08-31
---
When people ask me what I do all day, I usually start by saying "there are a lot of ways AI can go wrong". I believe this, but recently I've got to thinking that just "prevent the bad thing from happening" isn't very likely to lead to a world I want to live in. Instead, I think it is helpful to figure out what it would take to get to a concrete world you *would* like to live in.

**Epistemic Status**: I have not read the full literature on what good AGI futures might look like, nor ways it could go wrong. Both seem very deep! I'm probably wrong in a number of ways (I welcome any critiques).

Despite not having read the whole canon, I still found this to be a very helpful exercise. I now feel like I can say "I think X would be helpful for getting to the good ending by making Y more likely". It has significantly updated how excited I am about various research agendas ([defensive acceleration](https://vitalik.eth.limo/general/2023/11/27/techno_optimism.html)[^5] in particular was a big winner).

# An Example

The rest of this post will explain where I've landed on my personal vision. I anticipate it will change as time goes on, but for the time being, this is where my backchaining starts. Roughly speaking, I can divide it into four layers[^1]:
1. Terminal, or near terminal goals ("what does the good future look like")
2. Major threats to those terminal goals
3. What developments are most likely to counter the threats
4. What concrete actions can be taken towards those developments

Layer 3 was what I was missing before: these are concrete, positive things that need to exist in the world in order to get to the good future. They do *not* take the form of negatives (eg: "there is no misaligned superintelligence"). Having a positive to work towards (even if the positive is in service of avoiding a negative) made it a lot clearer to me what strategies in layer 4 were most helpful.

Briefly, my Layer 1 is something like: A good world is one in which individual humans and society as a whole are able to move towards better versions of themselves. For individuals, this means preserving agency. On the societal level, this is essentially [viatopia](https://www.forethought.org/research/viatopia). Layer 2's most significant threats can be categorized into "catastrophic terrorism" (a low-resource actor inflicting irrecoverable harm via [offense-dominance](https://www.tandfonline.com/doi/full/10.1080/01402390.2019.1631810)), "power concentration" (a single/small group of humans or AIs grabbing all of the power), and [gradual disempowerment](https://gradual-disempowerment.ai/).

To avoid the threats of Layer 2, I imagine a world with AI that is:
- [[#Pluralistic AI|Pluralistic]] - in the sense that it embodies diverse values and makes up a multi-polar order
- [[#Individually Controlled AI|Controlled by individuals]] - individual humans have some inalienable control of powerful AI
- [[#Agency-Preserving AI|Agency-preserving]] - fronts human decision making as much as possible
- [[#Individually Aligned AI|Aligned to individuals]] - humans have AI agents that pursue their principal's unique interests

This world also is [[#A Hardened Society|Hardened against terrorism]].

## Pluralistic AI

"Pluralistic AI" as I'm using it here means that there are many different AIs that are pursuing different goals. Each is (maybe imperfectly) aligned with some subset of humanity, but not necessarily all of humanity. No single AI dominates the power landscape.

It seems very unlikely to me that we'll ever be able to set up a single actor that is aligned to some abstract notion of "the Good"[^2]. Even if I assume the actors setting up the Benevolent Overlord are well-intentioned (Big if! There are a lot of perverse incentives involved), I find it pretty unlikely that their idea of "the Good" aligns well with mine.

Multiple actors pursuing different goals can keep each other in check. This is the basic advantage of "multipolar" futures[^4]. It mitigates the effects of misalignment, because each superpower must compromise with the others that have somewhat different goals. The paperclip maximizer no longer can turn the whole lightcone into paperclips since the other ASIs won't let it[^3]. I personally can think of very few examples in history where an actor having unchecked power has gone well for society.

By being (mostly) aligned with different human groups, we avoid foreclosing on good potential futures.

## Individually Controlled AI

[The Intelligence Curse](https://intelligence-curse.ai/)[^6] lays this out in much more detail, but the core problem here is that the economic and military hard power of different groups exerts powerful pressure on the structure of society. Most people have basically two levers of power: they can trade their labor and they can threaten to topple a system they don't like. Our current technological situation means that these levers of power create incentives for society to be happy, healthy, and well-educated, but that hasn't always been the case (and isn't the case in many parts of the world). AGI threatens to nullify the two levers of power by replacing labor with capital and by automating military strength.

To keep the incentives pointed in the right direction, individuals need to retain hard power. One straightforward way to do this is that they have some kind of inalienable (or near inalienable) control over AI (or the inputs thereof). Labor is replaced by the ability to lend the use of intelligence. This control must extend far enough that the individuals can also use the AI to threaten those who would abuse power.

## Agency-Preserving AI

This is perhaps the fuzziest target for me, as I'm not sure exactly how to operationalize "agency preserving". However, I deeply value the ability for individuals to make meaningful choices for themselves, and to *choose* to improve. This is related to gradual disempowerment.
## Individually Aligned AI

"Individually aligned AI" here means that individual humans have AI that pursues their own unique interests. I have big open questions on what exactly that means (does it just do what the person says? What is "best for them"? etc), but the basic idea is a start.

Individually aligned AI supports the other three:
- Individually aligned AI is just Pluralistic AI where the "subset" to which the AI is aligned is individual humans and minus the requirement that no one AI dominates.
- I have a hard time imagining how AI could be effectively individually-controlled without being individually-aligned.
- If the interests of a person is defined to include their agency, then by definition Individually-aligned AI would seek it

I include it as a separate point because it is a helpful mental target for me.
## A Hardened Society

Some of my targets, especially individually aligned AI, increase the risk of catastrophic terrorism. However, I have a hard time seeing a good future without those targets. Therefore, the best path seems to be to try to set up society in such a way that we can deal with the threats. This doesn't necessarily look like building safeguards such as refusals into the models themselves (seems hard to do while having individually controlled, pluralistic AI). Instead, this could be things such as DNA-synthesis screening for biosecurity or secure program synthesis for cybersecurity.

This seems like the most uncertain part of my vision. Is it actually possible to build such a hardened society? Maybe there legitimately are some domains that are just inherently offense-dominant. But I have a very hard time imagining a good future where we haven't figured this out. Hence I have updated significantly towards thinking defensive acceleration is important.

[^1]: This is a post-hoc categorization. My actual process was much messier than working through these one layer at a time.
[^2]: As far as I can tell, this is Anthropic's goal, and it's a big reason why I've become somewhat disillusioned with them.
[^3]: It's not really clear to me though, if a world with a paperclip maximizer, a pencil maximizer, and a rubber duck maximizer is actually any better than just one of them. I think this argument works better if the ASIs are only *somewhat* misaligned, in which case the overlap in their interests is more likely to be aligned with humanity.
[^4]: Multi-polarity doesn't solve everything. See https://www.alignmentforum.org/posts/LpM3EAakwYdS6aRKf/what-multipolar-failure-looks-like-and-robust-agent-agnostic
[^5]: The label "d/acc" comes with a lot of associations that I'm not sure I agree with yet, so I use the more specific term "defensive acceleration".
[^6]: My vision in general is actually very similar to the one laid out in the Intelligence Curse. I hadn't read it before putting a lot of these ideas together, but it seems likely in retrospect that a lot of ideas from it had filtered through to me one way or another.