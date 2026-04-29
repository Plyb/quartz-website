---
title: What Do You Mean By A Two-Year AGI Timeline?
date: 2026-04-29
---
Until recently, I was a bit confused about what people meant when they talked about AGI[^1] timelines. My hope in writing this short note is to help clarify things for anyone in a similar position.

In casual conversation, people often say something like "I have a two-year AGI timeline", without defining what exactly "two years" means here. Implicitly, there is a probability distribution over when AGI will arrive. If you're anything like me, your first instinct was to assume they meant [expected value (mean) of that distribution](https://amsi.org.au/ESA_Senior_Years/SeniorTopic4/4e/4e_2content_4.html). However, if you place *any* probability on AGI *never* being developed[^2], the expected arrival time becomes undefined[^3]!

As far as I can tell, there are a couple of things people *could* mean when they talk about AGI timelines.
1. Conditional mean: the same as the simple expected value, but only considering the cases where AGI arrives at some point.
2. Median or Percentile: the point at which it becomes more likely than not[^4] that AGI will have arrived. My guess is this is what most people mean, since this seems to be very common in cases where the definition of the metric is explicitly given: see Metaculus, Manifold, Epoch AI, and ESPAI.

It's also possible that people are just speaking casually and don't have a specific metric in mind when they give timelines, but I think it's worth thinking about. It may be helpful to occasionally explicitly state what metric you're using. It may also be worth mentioning, alongside the timeline number, if you place a non-negligible probability on AGI never being developed.

[^1]: Pick your favorite definition of AGI with no loss in generality.
[^2]: This could be for any number of reasons, such as a prior, non-AGI-induced catastrophe, or perhaps we somehow enforce an indefinite ban on AGI development.
[^3]: A couple of ways you could model this: either "AGI is never developed" is defined as probability mass at infinity on an extended number line, or the random variable of when AGI is developed may be undefined. Either way, the unconditional expected value is either infinite or undefined.
[^4]: In the case of medians. In some cases, metrics such as a 90th percentile are used.