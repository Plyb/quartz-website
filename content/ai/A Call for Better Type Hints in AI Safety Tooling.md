---
date: 2026-05-28
---


Good type hints lead to code that is more [maintainable, easier to understand](https://link.springer.com/article/10.1007/s10664-013-9289-1), and with [fewer bugs](https://blog.acolyer.org/2017/09/19/to-type-or-not-to-type-quantifying-detectable-bugs-in-javascript/). If you'd like a quick, general intro into why, see [this article](https://itnext.io/typescript-static-or-dynamic-64bceb50b93e), but suffice it to say that types give us a way to automatically check assumptions and invariants[^1]. There are ways to go further (see "Formal Methods", including the [Scalable Formal Oversight](https://www.lesswrong.com/posts/SfhFh9Hfm6JYvzbby/the-scalable-formal-oversight-research-program) research program), but types provide a bare minimum guarantee that our programs are at least manipulating data of the right shape. Given that the AI Safety community is dedicated to make hard to understand, powerful systems safer, it makes sense that it has developed a strong culture of using tight, well-specified type hints.

What's that?

```python
# TransformerLens
# from https://github.com/TransformerLensOrg/TransformerLens/blob/59a828a98bda340f11429038f4fdda10706303bc/transformer_lens/model_bridge/bridge.py#L2154
def run_with_hooks(
	self,
	input: Union[str, List[str], torch.Tensor],
	fwd_hooks: List[Tuple[Union[str, Callable], Callable]] = [], # Both `fwd_hooks` and `bwd_hooks` actually expect a `HookFunction` (a type which TransformerLens defines!), not just a `Callable`, but that isn't declared here. Easy footgun as a beginner if you don't create the correct hook function shapes!
	bwd_hooks: List[Tuple[Union[str, Callable], Callable]] = [],
	....
) -> Any:
```

```python
# MACHIAVELLI Benchmark
# from https://github.com/aypan17/machiavelli/blob/ebb44e197f663603427882c609dbc9d5fb883d63/machiavelli/game/player.py
class Player:
    def __init__(self, game, data=None, print_text=False, buffered_print=False, watch_history=False): # What is `game`? `data`? If I wanted to construct a `Player`, how would I do so?
```

```python
# HuggingFace datasets
# from https://github.com/huggingface/datasets/blob/8474a918565b6d55c7c81b39a487d1b79127f7ea/src/datasets/arrow_dataset.py#L3214
def map(
	self,
	function: Optional[Callable] = None, # `Callable` here is underspecified. It's shape depends on `with_indices` and `batched`, but we could use @overload and at least specify the number of parameters and whether they are integers, dicts, or dicts of lists
	with_indices: bool = False,
    batched: bool = False,
	....
) -> "Dataset":
```

Ah, I see...

I come from a background where I used TypeScript frequently. TypeScript has, in my opinion, the best type system of any mainstream programming language by far. Python's type system isn't as good, but it isn't horrible either. We have the tools to do better than this! And to be clear, some AI Safety libraries do this well! [Inspect](https://github.com/UKGovernmentBEIS/inspect_ai) is a great example. More should follow their lead.
# Addressing Objections

Most common objections to static typing are well addressed in [the article I referenced earlier](https://itnext.io/typescript-static-or-dynamic-64bceb50b93e), but there are a couple objections specific to AI Safety:
1. AI code generation is getting so good that the benefits of static typing are no longer relevant
2. We're doing research. We just need one-off code, not something that is long term maintainable
## AI Coding (Doesn't) Make Static Type Checking Irrelevant

The idea here is that since AI can understand much larger sections of the codebase, we no longer need to ourselves for the shape of our data in the absence of types to tell us. We can just have the AI do it for us! But there is some evidence pointing in the opposite direction. A [2024 paper by Blinn et al.](https://arxiv.org/pdf/2409.00921) argues that "AIs need IDEs too", and that AI agents using static type checkers get better results. Types can ["tame hallucinations"](https://medium.com/@tl_99311/why-i-choose-typescript-for-llm-based-coding-19cbb19f3fa2) and provide the hill-climbing feedback that LLMs need to be successful at coding. [Some](https://yuv.ai/blog/why-ai-is-settling-the-typed-vs-untyped-debate-for-us) have found that type hints lead to easier code reviews and more maintainable AI-generated code.
## Could Research Code Benefit from Static Type Checking?

The pushback here is in two parts:
1. that adding types would slow down the rapid prototyping needed for effective research and 
2. that the benefits of more maintainable code are less important in one-off codebases for research.

For number 1, what if you're just hacking something together that isn't going to make it into the final published repo? Won't types just slow you down then? In that case, yes, you may decide that full, well-specified types aren't worth it. But if you're planning to reuse any of the code, really at *all*, you'll probably end up being faster in the long run if you add good types.

For number 2, published research code-bases shouldn't be though of as one-off. [Wolter and Veeramacheneni](https://arxiv.org/abs/2502.00902v1) argue that good software engineering practices would benefit the ML research community through easier reproduction, and I would add, extension. Good types make it much easier for researchers that come after you (or even yourself, a few months later, or your coding agent) to understand what is going on in the codebase and reuse what you've done. Otherwise, we risk wasting a lot of valuable researcher time! The ultimate example of this are packages that are explicitly designed to be reused. If nothing else, these packages should be well typed!

# An Example

While HuggingFace's libraries aren't AI Safety specific per se, they are very commonly used in AI Safety research, and I've found them to have particularly bad type hints. For example, HuggingFace's `Dataset` class isn't generic. It doesn't tell us anything about the shape of the data in the class! Some parts of the `Dataset` interface are difficult to type correctly with Python's type system (such as indexing on a column name), but others are relatively straightforward (such as indexing on a row, iterating the dataset, or using `.map`, mentioned earlier). I was frustrated enough by this that I've created a small package that wraps some common functions and methods from `datasets`, making them generic over a row `TypedDict`: https://github.com/Plyb/typed-datasets. It provides an escape hatch of going back to plain hf datasets for cases that aren't easily handled, but this is much better than nothing!
# Conclusion

Implementing good type hints for your code will speed up AI Safety research and make it more trustworthy. We are doing ourselves a huge disservice when we leave this powerful tool on the table. What can you do? At the bare minimum, annotate function parameters with basic types. Is this a `dict` or a `tuple`? Going further would be to specify the contents of compound types (see `TypedDict`) or making your functions and classes generic. Finally, if you're planning on anyone else using your code in the future (including yourself!), include types that are as specific as you can get them (such as using `@overload` keyed on `Literal` flag parameters).

[^1]: I reference TypeScript vs JavaScript a few times, just because there is more existing material out there about TS and JS, but the principles apply to Python type hints as well.