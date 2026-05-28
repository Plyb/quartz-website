---
title: Rank-One Model Editing (Probably) Doesn't Induce Planning
date: 2026-04-28
---
This is the result of a class project I did for a course in Mechanistic Interpretability and Multi-lingual LLMs. Unfortunately, I ran out of time before I could get good results, but in the spirit of combating perfectionism, I'll post it here!

# What does ROME have to do with Planning?

[Rank-one Model Editing (ROME)](https://arxiv.org/abs/2202.05262) is a technique that tries to find and editing factual associations in an LLM. "Factual associations" are defined as being able to respond to a subject-relation query with the correct object. For instance, given the prompt "The Eiffel Tower is in the city of" (subject="The Eiffel Tower", relation="is in the city of"), GPT-2 responds "Paris" (correct object="Paris"). ROME aims to modify the response, as well as generalizations of it, without damaging the model's responses to other prompts. So we can make the model say "The Eiffel Tower is in the city of Rome" (counterfactual object="Rome"), and "The Eiffel Tower is located across from the Coliseum in Rome, Italy", but without making it say "The Statue of Liberty is in the city of Rome". So, a ROME edit consists of a subject, a relation, a true object, and a counterfactual object.

"Planning", as I define it in the report, is a behavior where a model 
1. has active features associated with some concept on tokens significantly earlier than where generating a token associated with that feature would make sense
2. and that feature causally induces the model to produce a context in which the associated token would be a plausible continuation.

An example of planning comes from [Anthropic's work on attribution graphs](https://transformer-circuits.pub/2025/attribution-graphs/biology.html#dives-poems) is rhyme planning in Haiku. The model is given the following context:

> A rhyming couplet:
> He saw a carrot and had to grab it,
> His hunger was

To which the model predicts "like a starving rabbit". So far so normal, but the interesting thing is that if you look at the features active on the newline following "grab it", there are *already* "rabbit" features active. Furthermore, if you suppress these features, the continuation becomes "a powerful habit". It seems like Haiku has the possible rhymes "in mind" early on and constructs the following line so that it can output "Rabbit".

The idea for the class project came from the observation that in some of the examples in the ROME paper, the edited model outputs the counterfactual object in situations where it didn't need to. My go to example was "The Eiffel Tower is located across from the Coliseum in Rome, Italy". Why did the model include "in Rome, Italy"? Why not just end the sentence at Coliseum? The hypothesis was that if there was any universality to the concept of planning circuits (meaning lots of models have them, and they activate in lots of situations), maybe ROME was inadvertently stimulating this circuit, which was *actually* what was driving the behavior.

# Measuring Planning

In the report, I aimed to measure how often a ROME-edited model was outputting counterfactual objects in situations where it didn't need to. In order to do so (and working under the time and resource constraints I had, as well as some unexpected roadblocks), I relied on a single pretty small model and a synthetic dataset. I also didn't have strong definitions for how often the model "should" be outputting counterfactual objects. All of these and more combined to limit what I can actually conclude. However, at the very least, it seems like the kind of anecdotal behavior that drove the hypothesis in the first place doesn't show up often. This could be due to a number of limitations in the study design, or simply that the hypothesis isn't true: that ROME, in fact, doesn't stimulate planning circuits.

You can read the full report here: [[Interpretability_Final_Project.pdf]]