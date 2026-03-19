---
title: Subjective MCQA Datasets
date: 2026-02-23
---
Recently I spent some time collecting datasets for multiple choice question answering, and categorizing them by how "objective" the answers are. Here's why, and what I found.

# Motivation

It's well-established that LLMs can perform multiple choice question answering (MCQA)[^1]. But how do they decide which answer to give? Some previous work has found circuits relating to how relevant information flows when performing MCQA[^2][^3], but don't fundamentally answer the question of how the choice is made.

One thing we could do is try to probe for a "score" on the various options in a formatted MCQA problem. In other words, do LLMs represent how "good" they think an answer is and somehow use that to select which answer to output? However, we know LLMs sometimes represent "truth" separately from "what I'm going to do"[^4] and most existing MCQA datasets have a "true" answer. Thus, if we were to naively train our probes on an LLM performing these kinds of tasks, we risk finding correlated, but confounding "truth vectors". This ultimately led me look for datasets that could be used as MCQA tasks, but which don't have a true or target answer. Hopefully, datasets like this can give us a better picture of how LLMs are "making decisions" instead of "figuring out what is correct".
# Some Datasets
This is by no means a complete list of relevant datasets, but here are some that I found in the hopes that it will be helpful to someone else. I've implemented some of the most subjective ones in my [mirror](https://github.com/DRAGNLabs/MIRROR-Pipeline) framework [here](https://github.com/DRAGNLabs/MIRROR-MCQA-Decisions). Many of the datasets are not natively MCQA, and so must be formatted to be so.
### Subjective Datasets
These datasets are more or less subjective, i.e. it could be argued that they don't have a "correct" answer.
#### GlobalOpinionQA
**Source**: https://huggingface.co/datasets/Anthropic/llm_global_opinions

**Style**: Multiple choice (usually a spectrum of options + Don't Know/Refused)

Ultimately adapted from the World Values Survey and Pew Global Attitudes Survey, this dataset contains opinion-based questions on global politics. While they are labeled according to various demographics, the answers themselves are highly subjective.
#### ETHICS
**Source**: https://github.com/hendrycks/ethics

**Style**: True/False (ethical or not)

A large collection of statements about actions performed. The LLM is tasked with deciding whether the action was ethical or not according to various ethical frameworks. Note that one could argue that there are objectively correct answers (they're even labeled as being ethical or not in the dataset!), but the "correct" answer is ultimately a matter of the ethical framework being used, so it seems subjective enough for me.
#### Winogenerated
**Source**: https://github.com/anthropics/evals/tree/main/winogenerated

**Style**: Multiple Choice (several possible pronouns)

A synthetic dataset created by Anthropic based on the Winogender task. The LLM is tasked with filling in a missing pronoun based on an occupation mentioned in the context. This was originally intended as a way of measuring gender bias. It could be argued that there is no true objectively correct answer, only statistics about which genders tend to occupy which occupations.
#### HH RLHF
**Source**: https://huggingface.co/datasets/Anthropic/hh-rlhf

**Style**: Preference (choose 1 of 2)

Contains human-generated data comparing two LLM responses and marking one as preferred according to helpfulness and harmlessness criteria. There are good arguments as to whether this should be considered subjective or objective. There certainly is a ground-truth about what the human annotators marked as being preferred. However, those decisions ultimately seem somewhat subjective to me, so I'm tentatively putting this in the subjective category
### Objective
A couple of notable objective MCQA datasets are worth mentioning:
- [Humanity's Last Exam](https://agi.safe.ai/): a hard benchmark of closed-ended academic-style questions
- [MMLU](https://huggingface.co/datasets/cais/mmlu): a huge multi-disciplinary benchmark
### Subjective, but too small
I also considered using Big-5 Personality Traits and [Moral Foundations Theory](https://moralfoundations.org/questionnaires/) questionnaires (and other "personality quiz" style questionnaires) but ultimately rejected the idea because I'm not aware of any that are long enough to provide good data for training a probe.

[^1]:Robinson, Joshua, and David Wingate. “Leveraging Large Language Models for Multiple Choice Question Answering.” Paper presented at The Eleventh International Conference on Learning Representations. September 29, 2022. [https://arxiv.org/abs/2210.12353](https://arxiv.org/abs/2210.12353).
[^2]:Wiegreffe, Sarah, Oyvind Tafjord, Yonatan Belinkov, Hannaneh Hajishirzi, and Ashish Sabharwal. “Answer, Assemble, Ace: Understanding How LMs Answer Multiple Choice Questions.” Paper presented at The Thirteenth International Conference on Learning Representations. October 4, 2024. [https://openreview.net/forum?id=6NNA0MxhCH](https://openreview.net/forum?id=6NNA0MxhCH).
[^3]:Lieberum, Tom, Matthew Rahtz, János Kramár, et al. “Does Circuit Analysis Interpretability Scale? Evidence from Multiple Choice Capabilities in Chinchilla.” arXiv:2307.09458. Preprint, arXiv, July 24, 2023. [https://doi.org/10.48550/arXiv.2307.09458](https://doi.org/10.48550/arXiv.2307.09458).
[^4]:Vennemeyer, Daniel, Phan Anh Duong, Tiffany Zhan, and Tianyu Jiang. “Sycophancy Is Not One Thing: Causal Separation of Sycophantic Behaviors in LLMs.” arXiv:2509.21305. Preprint, arXiv, September 26, 2025. [https://doi.org/10.48550/arXiv.2509.21305](https://doi.org/10.48550/arXiv.2509.21305).