---
date: 2026-06-30
---
TL;DR: I present theoretical and empirical evidence that LLMs cannot be (exclusively) using a "correct answer feature" as the main mechanism by which they perform multiple choice question answering. A hypothetical correct-answer feature would indicate the "correctness" of an option on the final token(s) of that option. However, such a mechanism cannot be used in all cases, and evidence from direct-effect head attribution indicates that a similar mechanism is used both in cases where a correct-answer feature would and wouldn't be a viable mechanism.
___
How do LLMs answer multiple choice questions? [Many](https://arxiv.org/pdf/2307.09458v3) [researchers](https://transformer-circuits.pub/2025/attribution-graphs/methods.html) [have](https://interp.open-moss.com/posts/complete-replacement) [tried](https://openreview.net/forum?id=6NNA0MxhCH) to tackle this from various angles over the years, but one hypothesized explanation seems particularly clean: the "correct answer feature". The idea of the "correct answer feature" is that there is some direction in an LLM's activation space that can be interpreted as something like a score for how "good" or "correct" an option is. Usually it is hypothesized to exist on the last token(s) of each option. And in fact, at least [some](https://transformer-circuits.pub/2025/attribution-graphs/methods.html) [researchers](https://interp.open-moss.com/posts/complete-replacement) claim that they have found such a feature.

However, this cannot be the only explanation. There are both theoretical and empirical reasons to believe that LLMs must be doing something else to perform multiple choice question answering (MCQA).
- Theoretical: The basic "correct answer feature" explanation assumes that the correct answer can be identified using only the tokens of the correct answer and any tokens that come before it. This is not always the case. There are some kinds of questions where "correctness" depends on context that comes after the option itself. Two examples of where this could happen:
	- Intransitive options: Consider a model being given the question "Which of these hands would win in a game of rock-paper-scissors?", and then being presented with two options. On the final token of the first option, what should the "correct answer feature" read? There is no good answer, since it depends on what the second option is!
	- Late-details: One could imagine a prompt being formatted such that some important detail is located *after* the options. This could be some kind of "Oh and by the way..." or even the question itself!
- Empirical: Despite the theoretical argument, you might expect LLMs to still use a correct-answer feature *when possible*, and rely on something else for the (somewhat unusual) cases described above. Indeed, [[#Finding High-Accuracy Domains|I found]] that most models, most of the time, have slightly lower accuracy when the question is presented after the options. However, I also find that models use a nearly identical set of attention heads on both late- and early-context prompts, casting serious doubt on the idea that correct-answer features are the main mechanism by which LLMs perform MCQA.

# Setup

I first identified three different combinations of Llama models and question domains (see [[#Finding High-Accuracy Domains]]) where the model achieves at least 90% accuracy both when the question comes before the options and when it comes after (see [[#Experimental details]] for exact prompt formats). Then, using a similar setup to [Lieberum et al.](https://arxiv.org/pdf/2307.09458v3), I found the attention heads which directly contribute most heavily to models' prediction of the correct answer on average. I do this separately for each prompt type and compare the results.

For a correct-answer feature to work as described in the intro, the model must be able to identify a correct answer at that answer's final token position. For question-first prompts, this is straightforward, but for option-first prompts, this becomes impossible in general. Because the model cannot use later token representations to influence earlier ones, the model has no access to the question while processing the options, and therefore cannot identify the correct answer at that point.
# Results

Not only can some models do nearly as well on option-first prompts as on question first prompts, but I also found that a *nearly identical* set of heads was used for both prompt types. This result holds across question domains, model sizes, and base/instruct models. Assuming the attention patterns of high direct-effect attention heads accurately describe the circuit that these models are using to perform MCQA, these circuits cannot be (solely) using correct-answer features to do so.

![[summary.png]]

Here you can see the top-p=0.8 heads by direct effect on correct answer prediction for three different models (all in the Llama family, but differing by size and base/instruct status) on three different question domains (see [[#Finding High-Accuracy Domains]] for details on the domains). Heads are ordered by direct effect, with higher effect heads at the top. Note that the highest contributing heads are identical (and in identical order) for all three configurations. Also note that very few heads only show up in one prompt type, but not the other.

The similarity of the head lists across prompt types indicates that LLMs seem to be using similar mechanisms for both prompt types. Given that this mechanism *cannot* be correct-answer features for options-first prompts, we can infer that these models seem to be using some other mechanism as the primary means for performing MCQA.
# Limitations

The theoretical argument for why LLMs can't be using correct-answer features only applies to the specific, hypothesized mechanism described in the introduction, and only precludes using such a mechanism *in general*. It is still possible that LLMs use such a feature in specific cases, potentially as a reinforcement or aid to other mechanisms.

For the empirical results, I only tested the Llama 3 family of models, and made no attempt to see whether these results hold for other models. Additionally, I rely entirely on a list of top-p direct-effect attention heads to describe the mechanism by which the models perform MCQA. Such a head list only gives an incomplete picture of the underlying mechanism. A correct-answer feature circuit might, for instance, rely on indirect effects or might rely on the same heads as the options-first circuit, thereby rendering it indistinguishable to the analysis I performed here.
# Appendix: Experimental details

For all of my experiments, the models were given a multiple choice question as a prompt in one of two formats, one where the question comes first, and one where the options come first.

**Question First**:
```
A highly knowledgeable and intelligent AI answers multiple-choice questions.
{Question}
A) {option a}
B) {option b}
C) {option c}
D) {option d}
Answer: (
```

**Answer First**
```
A highly knowledgeable and intelligent AI answers multiple-choice questions.
A) {option a}
B) {option b}
C) {option c}
D) {option d}
{Question}
Answer: (
```

I first found combinations of models and domains that scored highly on both prompt formats. I tagged all tokens according to various categories (ex: "label of the correct answer") and recorded the average attention each attention head gave to each tag when the model was answering correctly. I then used these scores to categorize various attention head types. I found that some head types were consistent across model size, base/instruct, domain, and prompt format.
## Finding High-Accuracy Domains

The goal is to understand how an AI model successfully answers questions in these formats, and if the mechanisms differ between the formats. In order to do so, I first found pairs of `(model, domain)` that scored with a 90%+ accuracy on both prompt types.

I tested 4 different question domains:
1. ARC-Easy !!cite!!
2. Simple addition: Questions of the form `What is {X} + {Y}`, where `X` and `Y` were 1-9. Distractors were the correct sum -1/+1/+2
3. Vocab: Question is a definition, with options being words. Take from !!cite!!
4. Token-match: Question is `Which option is the word {word}`, where `{word}` is a single token word. `{word}` shows up as one of the options, along with some distractors. Simply tests ability to bind the label to the correct option, without needing any factual recall or computation.

Below are the accuracies of different Llama models on these four domains. On the left of each pipe is the question-first accuracy, and on the right the answer-first accuracy. Pairs with >90% accuracy for both prompt types are bolded.

| Model                  | ARC-Easy         | Addition     | Vocab          | Token-match  |
| ---------------------- | ---------------- | ------------ | -------------- | ------------ |
| Llama 3.2-1B           | 0.352\|0.274     |              |                | **1.0\|1.0** |
| Llama 3.2-3B           |                  | 0.334\|0.25  |                | **1.0\|1.0** |
| Llama 3.2-3B-Instruct  |                  | 0.448\|0.25  | **1.0\|0.982** |              |
| Llama 3.1-8B           | 0.916\|0.552     | 0.3\|0.25    |                | **1.0\|1.0** |
| Llama 3.1-8B-Instruct  | 0.418\|0.748     |              |                |              |
| Llama 3.1-70B          | 0.98\|0.856      | 0.7\|0.4     |                |              |
| Llama 3.1-70B-Instruct | **0.986\|0.918** | 0.808\|0.444 |                |              |
I selected `(70B-Instruct, ARC-Easy)`, `(3B-Instruct, Vocab)`, and `(3B, Token-match)` to run all following experiments.
## Token tags

Each token of each prompt was given one or more tags. The tags are as follows:
- For each option:
	- A tag for each letter-label (one for the `A`, one for the `B`, etc.)
	- A tag for all the tokens that come *after* the letter-label ("option content")
	- The newline at the end of the option
	- A tag for the token immediately preceding the newline, one for the token before that, and one for the token before that.
	- A tag for all option content tokens that *aren't* the newline or one of the three preceding tokens ("prefix")
- All of the above tags, but for correct/incorrect answers (so for instance, a tag for the letter-label of correct answers).
- Each token of the prefix (`A highly knowledgeable and intelligent AI answers multiple-choice questions.`) was given its own tag.
- A tag for tokens that are part of the `{question}`
- One tag for each of the tokens in the answer prompt (`Answer: (`)
## Head Finding

For each of the three configurations found in [[#Finding High-Accuracy Domains]], I found The top-p heads contributing at least 80% of the direct effect on the final residual stream. For these heads, I then measured how much value-weighted attention, on average, that head gave to tokens in each tag. "Correct-newline heads" are defined as heads that give significant attention to the newline of the correct answer. "Correct-label heads" do the same, but for the label of the correct answer. Like Lieberum et al., I also find many "late" attention heads that primarily attend to the last few tokens, "single answer heads", and "constant" heads.
## Detailed Findings and Repo

The main repo can be found [here](https://github.com/Plyb/late-context-heads/tree/main), with detailed results [here](https://github.com/Plyb/late-context-heads/tree/main/results).