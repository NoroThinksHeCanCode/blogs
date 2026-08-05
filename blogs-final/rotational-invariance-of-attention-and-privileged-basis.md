---
layout: layout.njk
title: Rotational invariance of attention and privileged basis
permalink: /blogs-final/rotational-invariance-of-attention-and-privileged-basis/
---

# Rotational invariance of attention and privileged basis

As a linear algebra enthusiast a very cool property of attention computation that I came across when I was reading [Anthropic's  A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html#architecture-attn-as-movement)
A **basis of a vector space** is defined as follows,

A basis $B$ of a vector space $V$ over a field $F$ (such as the real numbers $ {\displaystyle \mathbb {R} }$ or the complex numbers $\mathbb{C}$ ) is a linearly independent subset of $V$ that spans $V$. 

Upon digging deeper, I found out that attention operations do not depend on the basis vectors of the embedding space (or the residual stream). How does this work mathematically? 

Consider the general expression for a residual stream:
$$x_{l+1} = x_l + \text{Attention}(x_l) + \text{MLP}(x_l)$$
where $x_l$ is the $l^{th}$ layer's residual stream. 

To understand what it means for attention to not have a privileged basis, let's apply an orthogonal transformation to all the vectors in the residual stream,

$$x' = Rx$$ where $x \in \text{Residual Stream}$ and $R$ is a transformation such that $R^{T} = R ^ {-1}$. $R$ is just the $d_{model}$-dimensional rotation matrix. 

## Attention

The attention score relies on the dot products of the key and query vectors which are low rank projections of the residual stream. 

$$ q = W_Qx_i \text{ and } k = W_Kx_j $$

$$A_{ij} \propto (W_Q x_i)^T (W_K x_j) = x_i^T (W_Q^T W_K) x_j$$
Now applying the rotation, $x' = R x$, $W_Q' = W_Q R^  T$, and $W_K' = W_K R^T$ we get,

$$(x_i')^T (W_Q'^T W_K') x_j' = (R x_i)^T (R W_Q^T W_K R^T) (R x_j) = x_i^T R^T R W_Q^T W_K R^T R x_j = x_i^T (W_Q^T W_K) x_j$$

which is the same as applying attention without rotating the residual stream vectors. This is a pretty cool result that even if change our basis orthogonally, the attention operations remain the same.  

## MLP Head

An MLP layer is another bunch of linear transformations with its weight matrices. While looking at a residual stream there are two things an MLP head does it reads information from it and writes into it. This can be represented as two weight matrices $W_{read}$ and $W_{write}$.
Applying the rotation on these,

$$W_{read}'= W_{read}R \text{ and }W_{write}'= W_{write}R$$

$$W_{\text{read}}' x' = (W_{\text{read}} R^T) (R x) = W_{\text{read}} I x = W_{\text{read}} x$$

which is the same as applying the MLP head without rotation. 

This blog was written as a cool mathematical investigation of the properties of a transformer circuit. 
