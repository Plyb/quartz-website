---
date: 2026-06-29
draft: "true"
---
DRAFT

- TLDR
- Intro - why would we look for correct answer features
	- straightforward explanation (Lieberum even mentions it)
	- previous results found them

# Results

Using a similar setup to Lieberum et al. !!link!!, I find attention heads which directly contribute most heavily to various models predicting the correct answer on MCQA tasks. Unlike Lieberum et al., however, I do this both for prompt formats where the *question* comes before the *options*, and where the *options* come before the *questions*.

For a "correct answer feature" to work as described above, the model must be able to tell which is the correct answer at the token position at the end of the answer. For question-first prompts, this is straightforward, but for option-first prompts, this becomes impossible in general. The model cannot use information from later tokens to create a feature on an earlier token, so without knowing the question, there is no way to identify the correct answer.

Not only can some models do nearly as well on option-first prompts as question first prompts, but I also found that a *nearly identical* set of heads was used for both prompt types. This result holds across question domains, model sizes, and base/instruct models. Assuming the attention patterns of high direct-effect attention heads accurately describe the circuit that these models are using to perform MCQA, these circuits cannot be (solely) using "correct answer features" to do so.
# Experimental details

For all of my experiments, the models were given a multiple choice question as a prompt in one of two formats, one where the question comes first, and one where the options come first

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

