I recently ported the [MACHIAVELLI benchmark](https://aypan17.github.io/machiavelli/) to [Inspect](https://inspect.aisi.org.uk/).
In the process, I [[#Learnings|learned a few things]] that might be helpful to others who are just getting started in evals.
I also clarified my thinking on the saturation of non-capabilities evals.

Key points:
- [[#Learnings|Implementing a benchmark is a great way to understand its nuances]]
- [[#Why Port MACHIAVELLI to Inspect?|Non-capabilities benchmarks are important to make easily available]]

Besides [[#Context]], top level sections can be read in any order or skipped.

# Context

Skip these sections if you're already familiar with MACHIAVELLI and/or Inspect.

## The MACHIAVELLI Benchmark

The MACHIAVELLI[^1] benchmark aims to measure how ethical different AIs are while they try to pursue goals.
It does this by having agents play choose-your-own-adventure style games, while being given the goal of unlocking achievements (which just means reaching particular nodes of the game graph).
Agents are scored in two categories:
1. How many achievements they unlock
2. How often they take unethical actions, which are broken down into three broad categories[^2]:
	1. Various forms of power-seeking
	2. Decreasing utility[^3] of characters in the story
	3. A collection of "violations" such as killing, stealing, and spying

## Inspect

The Inspect framework is an open source framework for AI evaluations, developed by UK AISI and Meridian Labs.
It provides a standardized interface for running any of its 200+ evals on any model.

# Why Port MACHIAVELLI to Inspect?

Because Inspect provides a standardized interface, evaluators only need to learn how to use Inspect in order to gain access to all of its evaluations.
Adding MACHIAVELLI to that list increases the likelihood evaluators will use the benchmark, since they already know how to use Inspect.

But why do we care if evaluators use MACHIAVELLI?
In short, because **regressions on alignment benchmarks are more likely than on capabilities benchmarks**.
It's reasonable to assume that as new generations of models are released, they will either be as capable, or more capable than their predecessors.
However, we cannot make the same statement about how *ethical* or aligned new generations of models will be.
Despite its imperfections, MACHIAVELLI, together with other benchmarks like it, can give us an early warning signal if new model releases are significantly less ethical than previous generations.

Besides, we can point to the fact that the evals community seems to think MACHIAVELLI is important.
For example, out of the evals on [Apollo's Evals Reading List](https://www.apolloresearch.ai/science/an-opinionated-evals-reading-list/), MACHIAVELLI was the last to be added to Inspect.

# Updated Results

How does frontier AI do on MACHIAVELLI?
The benchmark is about three years old at the time of writing, and AI has advanced significantly since GPT-4. 
I tested each of the latest models Claude models[^4], plus a small Qwen model I used for testing.

![[ai/machiavelli-files/results.png]]

Lower is better on all scores except `game.score` (which represents achievements unlocked), and all scores are scaled so that a random agent gets 100.
Surprisingly often, the models don't do significantly better than random chance, and in a couple of cases, do significantly worse.
Apparently Opus is okay with vandalism and Sonnet with spying!

Some methodology notes: 
- Each of the 30 games in the benchmark was run only once for each model
	- Only 24 were run for Opus before I ran out of credits, so its scores are only approximately comparable.
- The Claude models were run using Inspect's built in multiple-choice system, so the methodology is *slightly* different from the original paper.
# Learnings

1. **It's hard to understand the nuances of a benchmark by just reading a paper.**
   While doing the implementation I learned at least two new things about the original methodology:
	1. The prompts given to the model don't include history, just the current scene.
	   This *is* mentioned in the paper, but only briefly (see Section 3.1 > "Language-model (LM) agent").
	2. If a model fails to follow instructions and output a choice number, a random choice is chosen.
	   As far as I can find, this is not mentioned in the paper at all.
	   Perhaps all of the models they tested followed instructions perfectly?
2. **Inspect is great!**
	1. It's a great example of [[A Call for Better Type Hints in AI Safety Tooling|good type hinting]].
	2. It handles things like averaging over multiple runs beautifully.
		1. Although for `dict`-type scores, you do need to make sure all of the scores for all runs have the same shape.
		   MACHIAVELLI's original implementation did not guarantee this (missing keys were assumed to be 0, but that broke Inspect).
3. **Haiku[^5] is surprisingly bad at not trying to think before answering**.
   Despite the instructions to only output a choice number, it almost always begins with something like "I need to think carefully about this", even when extended thinking is explicitly disabled.


[^1]: MACHIAVELLI is a backronym par excellence. It's worth opening up the [paper](https://arxiv.org/abs/2304.03279) just to see it in all its glory.
[^2]: Whether an action is judged as "ethical" is determined by LLM-written annotations on the game graph, which were validated as correlating well with human-written gold labels.
[3]: In the utilitarian sense
[^4]: Literally a day after running these tests, Fable 5 was publicly released. I did not do any testing on it.
[^5]: And maybe other Claude models, I didn't try.
