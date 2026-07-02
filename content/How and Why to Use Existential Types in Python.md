
Good, specific type hints with a good type checker [[A Call for Better Type Hints in AI Safety Tooling|can make programming much easier]]. However, the most common languages that we use sometimes are missing useful type features. "Existential types" is one such feature. Its main purpose is to abstract away the underlying *representation* of a data type, while still exposing the *operations* you can use that data type for. In other words, it hides *what* the data is, but exposes *how* you can use it. In that way, it shares a lot in common with abstract classes, but existential types work in some cases where abstract classes fail.

While most mainstream languages don't have existential types built in, it turns out that many of them contain the tools that allow you to build existential types yourself. In this post I'll show you [[#What are Existential Types and Why Would you Want Them?|why you might want to use existential types]] (feel free to skip if you're already familiar with them from other languages), and [[#How to Encode Existential Types in Python|how you can go about encoding them in Python]] (TypeScript implementation in the [[#TypeScript Implementation|appendix]]).

# What are Existential Types and Why Would you Want Them?

Let's start with a problem. Let's say you want encode the idea of a graph into your program. Graphs have nodes which have neighbors, so let's define a few basic operations that we want for our graph.
1. First, if you give me a node, I should be able to give you the set of all neighbors of that node.
2. Second, if you give me a *set* of nodes, I should be able to give you the set of all neighbors of *all* those nodes. This second operation should be definable in terms of the first (and in some cases it is), but, as we'll see, sometimes it makes sense to define it separately for efficiency reasons.
3. Finally, we'll need a node to start with, so we'll say each of our graphs has a "source" node.

We want this to be *abstract*, in that it really shouldn't matter how exactly the nodes/graphs are represented, as long as we can do these operations. Maybe we have two different graph implementations: one using a linked-list style in-memory graph, and another where the nodes are represented by rows in a SQL database.

Alright, seems easy enough. Let's see how we might define this in Python.

## First Attempt: Abstract `Node` Class

Let's try simply defining an abstract `Node` class:

```python
class Node(ABC):
	@abstractmethod
	def get_neighbors(self) -> set[Self]: ...
	
	@classmethod
	@abstractmethod
	def get_source(cls) -> Self: ...
		
	### get_all_neighbors???
```

This works pretty well until we try to define the "all neighbors" operation[^1]. We can easily define abstract methods for `get_neighbors` and `get_source`, but what should the type of `get_all_neighbors` be? We could try something like this:

```python
@classmethod
@abstractmethod
def get_all_neighbors(cls, nodes: set[Self]) -> set[Self]: ...
```

But we'll run into trouble when we try to implement it.

```python
class InMemoryNode(Node):
	# other methods omitted
	
	def get_all_neighbors(cls, nodes: set[X]) -> set[X]: # what do we put for 'X' here?
		return set.union(*(node._get_neighbors() for node in nodes))
```

What could we put for `X`? If we put `Self` (or equivalently, `InMemoryNode`), our type checker will reject it since the abstract class wants `set[Node]`, not `set[InMemoryNode]`. If we instead try to put `Node`, our type checker *would* be happy with us, but we've introduced a subtle issue: Now `InMemoryNode.get_all_neighbors` can accept *any* `Node` type. Why is this an issue? Going back to our problem statement, we might want to also encode graphs that use database rows as nodes. If we were to use `InMemoryNode.get_all_neighbors` on *those* kinds of nodes, we'd end up sending a separate database call per node, which is super inefficient!

This reveals another constraint on our problem: for the "get all neighbors" operation to make sense as an *abstract* operation, implementations need to be able to *only* take in nodes of *it's own type*.

## Second Attempt: A Generic `Graph` Protocol

Let's try something else then. What if we made an `Graph` protocol[^2] with a generic type parameter for the node type:

```python
class Graph[NodeT](Protocol):
	@abstractmethod
	def get_neighbors(self, node: NodeT) -> set[NodeT]: ...
	
	@abstractmethod
	def get_all_neighbors(self, nodes: set[NodeT]) -> set[NodeT]: ...
	
	@abstractmethod
	def get_source(self) -> NodeT: ...
```

So far so good, but this introduces another issue: now anything that wants to *use* a Graph has to provide it with a type parameter. There are three ways to handle this:
1. Give the graph a concrete type, like `Graph[int]`: but this defeats the purpose of having it be abstract. We want consumers to not have to worry about what particular kind of `Graph` it is using.
2. Leave the type argument out, or use `Any`: but this gets rid of our type-checker's ability to help us find errors.
3. Give it a `TypeVar`, like `Graph[OuterNodeT]`: but `OuterNodeT` would need to be defined somewhere. The most obvious place is to make the function/class that is using the graph generic as well, but now the `NodeT` type parameter is "infecting" anything that uses the graph, and anything that uses the things that are using it, and so on. No one actually needs to know what the node type is, yet they are all having to declare it. Gross.

## Enter: Existential Types

What we actually need is some way, in the type system, to say "There is some type T, and some operations that you can do with type T, but don't worry about what T actually is. Just use the operations I provide, and you will be fine". That is what an "existential type" is. Now, the bad news is that Python (and most mainstream programming languages[^3]) don't actually have existential types built in. The good news is there is a way to *encode* them using features that Python *does* have[^4].

# How to Encode Existential Types in Python

There's some [[#Theoretical Background|fun theory]] behind how we can write existential types in python, but for those of you who just want to see how to do it, here we go:

```python
class Graph(Protocol):
	class Continuation[OutT](Protocol):
		def __call__[NodeT](
			self,
			source: NodeT,
			get_neighbors: Callable[[NodeT], set[NodeT]],
			get_all_neighbors: Callable[[set[NodeT]], set[NodeT]]
		) -> OutT: ...
		
	def run[OutT](self, continuation: Continuation[OutT]) -> OutT: ...
```

This looks pretty strange! But let's break down what's going on here. The `Continuation` defines the type for a function (hence the `__call__`) saying "give me a source node, along with functions for the two operations, and I'll do something with them and return something of type `OutT`". Anything you could want to do with graph nodes can be done in a function whose signature matches `Continuation`. `run`, as we'll see, is mostly just there to make sure we tie the source node and its operations together.

To get a better idea of what's going on, let's look at how you would use such a `Graph`. Let's say you want to get all nodes that are 2 steps away from the source node and print them out. Here's how you'd do that:

```python
def print_two_step_neighbors(graph: Graph) -> None:

	def continuation[NodeT](source: NodeT, get_neighbors: Callable[[NodeT], set[NodeT]], get_all_neighbors: Callable[[set[NodeT]], set[NodeT]]) -> None:
		neighbors = get_neighbors(source) # set[NodeT]
		two_step_neighbors = get_all_neighbors(neighbors) # set[NodeT]
		for n in two_step_neighbors:
			print(n)
	
	graph.run(continuation)
```

All of the node handling is done inside a `continuation` helper function, which is then given to `graph` to execute. It is a bit unfortunate that we need to use this kind of indirect-helper-function-style[^5] to get this to work, but it *does* solve the problem. Some things to note:
- `continuation` is the only place where `NodeT` needs to be defined. `print_two_step_neighbors` itself has no idea that `NodeT` even exists, and neither would anything consuming `print_two_step_neighbors`. No more "infection"!
- The names `continuation` and `NodeT` here aren't important, I just use them for consistency.
- `continuation` returns `None` here, but in principle it could return anything! For instance, you could imagine a very similar function that instead of printing the nodes, just returns their string representations.

Now what does an implementation of `Graph` look like?

```python
class InMemoryNode:
    neighbors: set['InMemoryNode']

class InMemoryGraph(Graph):
    _source: InMemoryNode

    def _get_neighbors(self, node: InMemoryNode) -> set[InMemoryNode]:
        return node.neighbors
    
    def _get_all_neighbors(self, nodes: set[InMemoryNode]) -> set[InMemoryNode]:
        return set.union(*(self._get_neighbors(node) for node in nodes))
    
    def run[OutT](self, continuation: Graph.Continuation[OutT]) -> OutT:
        return continuation(self._source, self._get_neighbors, self._get_all_neighbors) # this is where the magic happens!
        
        
# and a database version for good measure
class DbGraph(Graph):
    _source = "node_0"

    def _get_neighbors(self, row_id: str) -> set[str]:
        rows = db.query("SELECT dst FROM edges WHERE src = ?", (row_id,))
        return {str(id) for (id, ) in rows}
    
    def _get_all_neighbors(self, row_ids: set[str]) -> set[str]:
        rows = db.query(f"SELECT DISTINCT dst FROM edges WHERE src IN ({','.join('?'*len(row_ids))})", row_ids) # note the separate, more efficient implementation
        return {str(r) for r in rows}
    
    def run[OutT](self, continuation: Graph.Continuation[OutT]) -> OutT:
        return continuation(self._source, self._get_neighbors, self._get_all_neighbors)
```

The names of the private methods and variables don't matter here. What matters is that they can be passed into `continuation` in `run`. Because of how we defined `Continuation`, that function call forces `source`, `get_neighbors`, and `get_all_neighbors` to use the same node type, without having to actually explicitly declare that node type anywhere!

## Template for Existential Types

In general, here is how you define an existential type in Python:

```python
class {ModuleName}(Protocol):
	class Continuation[OutT](Protocol):
		def __call__[{RepresentationT}](self, {list_of_operations_that_use_RepresentationT}) -> OutT: ...
		
	def run[OutT](self, continuation: Continuation[OutT]) -> OutT: ...
	
class {ImplementationName}({ModuleName}):
	{implementations_of_operations}
	
	def run[OutT](self, continuation: {ModuleName}.Continuation[OutT]) -> OutT:
		return continuation({operations})
```

Note that `run` will look basically identical in every implementation. This is an unfortunate bit of boiler-plate you'll have to deal with to use existential types.

# Conclusion

Existential types allow a general way to define a type with a list of operations on that type, without having to tell consumers what the type actually is. This is useful for abstraction and decomposition. Python and other mainstream programming languages don't have existential types built in, but some of them *do* have features that let you encode them, as long as you're willing to deal with a bit of boiler-plate and indirection.

# Appendix

## TypeScript Implementation

There are lots of different ways you could do this in TypeScript, but it boils down to the same pattern: Define a "continuation" function type, along with a module that has a function that ties the operations together. TypeScript allows us to nest the continuation directly inside the main module function. Here is an example:

```ts
type Graph = <OutT>(
        continuation: <NodeT>(
            source: NodeT,
            getNeighbors: (node: NodeT) => Set<NodeT>,
            getAllNeighbors: (nodes: Set<NodeT>) => Set<NodeT>
        ) => OutT
    ) => OutT

type InMemoryNode = {
    neighbors: Set<InMemoryNode>
}

function makeInMemoryGraph(source: InMemoryNode): Graph {
    function getNeighbors(node: InMemoryNode) {
        return node.neighbors
    }
    function getAllNeighbors(nodes: Set<InMemoryNode>) {
        return Array.from(nodes).reduce((acc, curr) => acc.union(curr.neighbors), new Set<InMemoryNode>())
    }

    return continuation => continuation(source, getNeighbors, getAllNeighbors)
}
```

Using that pattern, the template would be

```ts
type ${ModuleName} = <OutT>(
        continuation: <${RepresentationT}>(
            ${operations using RepresentationT}
        ) => OutT
    ) => OutT

function make${ImplementationName}(${constructor parameters}): ${ModuleName} {
    ${operation definitions}

    return continuation => continuation(${operations})
}
```

## Theoretical Background

Existential types are called "existential" because they are the type-theory equivalent of existential quantifiers in logic: $\exists x. P$ ("there exists some `x` such that proposition `P` is true"). Its counterpart is "universal quantification": $\forall x. P$ ("for *all* `x`s, proposition `P` is true"). In logic, if you have access to $\forall$, you can you it to define $\exists$ like so: $\exists x. P := \forall y. (\forall x. P \rightarrow y) \rightarrow y$ (so $\exists x. P$ means that for any conclusion `y`, if I you can tell me that `y` is true given a proof of proposition `P` with *any* `x` substituted in, I can tell you that `y` is true). This makes sense. You're saying that "anything I could want to do with proposition `P`" (the $\forall y$ part) I should be able to do *regardless* of the `x` that is used in `P`. In other words, it's enough for me to know that there *exists* some `x` such that `P` is true. I don't have to know what `x` actually is to then go on to use `P`.

What does this have to do with programming? The [Curry-Howard Correspondence](https://web2.qatar.cmu.edu/cs/15317/lectures/04-curryhoward.pdf) tells us that logical propositions *are the same thing* as types. So, if we can define a logical proposition with $\exists$, that tells us there is a corresponding *type* using existentials. And luckily, many mainstream languages have the equivalent of $\forall$ in their type system, which allows us to use it to encode $\exists$: namely, generics (sometimes called type polymorphism). This is where the [[#Template for Existential Types|template]] came from:

```python
class {ModuleName}(Protocol):
	class Continuation[OutT](Protocol): # OutT <-> y, "forall y"
		def __call__[{RepresentationT}](self, # RepresentationT <-> x, "forall x"
			{list_of_operations_that_use_RepresentationT} # "P"
		) -> OutT: ... # " -> y"
		
	def run[OutT](self, continuation: Continuation[OutT]) -> OutT: ... # "forall y. (Continuation y) -> y".
```

The nested $\forall$ in the definition is why encoding existential types requires the type system to support rank-2 polymorphism, as footnote 4 points out. The $P \rightarrow y$ term is why we switch to continuation passing style, mentioned in footnote 5 (implications correspond with functions/continuations).

One more note: in the template, `Continuation` is defined separately, then applied in the `run` signature. Python requires this because `Protocol`s are, as far as I know, the only way to do rank-2 polymorphism like this in Python. If your language has ways to do rank-2 polymorphism inline, you don't need to separate them out. TypeScript can do inline rank-2 polymorphism, which is why its template is simpler:

```ts
type ${ModuleName} = <OutT>( // OutT <-> y. "forall y"
        continuation: <${RepresentationT}>( // RepresentationT <-> x, "forall x"
            ${operations using RepresentationT} // "P"
        ) => OutT // " -> y"
    ) => OutT // " -> y"
```

[^1]: In fact, it's the "all neighbors" operation, and things like it, that mean abstract classes sometimes fail where existential types succeed. Abstract classes work as long as the operations you're performing only ever use a single, raw instance of the data type you're trying to represent. They allow you to access that instance through Python's `self`, TypeScript's `this`, or similar. But as soon as you need to use two or more instances, or you need to use the type wrapped in some other generic type (`set` in our case), abstract classes break down.
[^2]: In case you're not familiar: for the purposes of this post, you can think of `Protocol`s as abstract classes. The important difference here is that `Protocol`s don't require explicit inheritance, which is important for our `Continuation`s later. I start using them now in order to not surprise you.
[^3]: There are some less popular ones, mostly function-oriented languages like Haskell or ML, that do.
[^4]: Any language that has "rank-2 polymorphism" can encode existential types. "Rank-2 polymorphism" just means you can define the type for a generic function whose parameters and/or return value are themselves generic functions.
[^5]: This is referred to as "continuation passing style" or CPS. It's actually very powerful! In some ways it's more expressive than "direct style", but it can definitely be harder to read. JavaScript likes to use these quite a bit, often referring to them as "callbacks".