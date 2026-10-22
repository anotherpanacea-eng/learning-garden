# Repeat a Delivery Block: independent specification review

**Verdict: BUILD-READY after two substantive P2 fixes, both resolved in the spec before build. No unresolved P1/P2 findings.** This is pre-build specification/content clearance only, not implementation, art, browser, exact-commit, merge or deployment clearance.

The spec author is root; the reviewer previously provided inventory/source audit, not this specification. This review read the full proposal and audit71, actual Cartographer content/core/UI/jobs, Post and Instructions execution boundaries, Workshop route/notes/binder, host connection behavior and generic state-transfer seams. Six distinct focused passes were completed sequentially in this separate reviewer context. No runtime, test, specification, art or pin was edited by this reviewer. The arithmetic probe was temporary and read-only; no new repeat-delivery implementation exists to test or view.

## Required findings, resolved before build

**P2 — the historical check contract needed concrete types and a separate input validator.** The initial description named a terminal status and attempted/travelled counts without fixing their enum/nullability or locating `fulfilled`. Its “own source/input” admission wording could also lead a builder to apply current mathematical cursor rules to historical check inputs, rejecting rather than retaining an old bounded contradiction.

The actual revised spec now gives the complete check field set, status enum **incomplete/unstarted/ready/walking/blocked/finished**, nullable count/trace/expansion rules, and top-level boolean `fulfilled`. Fresh checks derive coherent relationships. Historical input admits bounded block/count/cursor/support shape without replaying it or applying the current working-run validator. The concrete count2/cursor6 example is admitted as recorded input; that same contradiction is refused as current live work. This resolves the construction/admission ambiguity without introducing a migration or regrading historical results.

**P2 — a swap-based “order repair” could not serve the four cases.** All fitting pairs are East/North or West/South in either order. Swapping the pair preserves displacement and cannot turn a failing delivery into a fitting one in these jobs. Requiring that repair could cause a builder to reject one valid staircase or invent an intermediate-stop obligation.

The actual revised acceptance wording now separates count repair **EN×2→EN×3**, arrow-edit repair **EE×3→EN×3**, and valid-order comparison **EN×3 versus NE×3**. It explicitly says a swap does not repair a failed delivery here. The grouped EEE NNN sequence remains a supplied expansion contrast, not an available flat-program input. This preserves meaningful path/order discussion without manufacturing a wrong answer.

A small familiarity clarification was also folded: source.id becomes seen only on explicit Start, and the label is **Job visited before**. Viewing, Resume, page changes and Check do not update it. A different task may share the same map family, so unfamiliar-job status does not claim an unseen chart or independent novelty.

## 1. Completeness — clean after the snapshot fold

The fixed grammar, explicit Start/Begin/Step/Restart/edit boundaries, source fields, safe IDs, raw preservation, retention and open pages now provide a buildable bounded contract. Only Start allocates the optional root/round; navigation cannot fill blank arrows/count or create a run. A run is tied to its current source/program through cursor-only derivation, with actual edits resetting the run and same-value selections preserving it. Checks freeze their own complete inputs and source rather than relying on a current catalog ID.

The concrete status/count schema resolves the significant omission. No further required field or action decision remains. **Blocking: false.**

## 2. Dependency and integration — real seams, bounded reuse

`walkMap` really accepts canonical cardinal IDs and0..5 points, returns travelled points/distance and a one-based blocked command, and can evaluate prefixes. Six expanded commands fit comfortably inside its12-command maximum. Source validation's fixed mathematical deltas mean older saved labels can use this walker without changing direction semantics.

The current `appendMapMove` rejects a boundary addition and some existing Cartographer mutators can start a map. The spec correctly excludes those mutators and requires retaining a whole mistaken proposal while deriving its blocked prefix. The existing grid renderer is local to Cartographer UI; the proposal authorizes original new diagram/control rendering using its conventions, so it does not assume an unavailable public renderer.

Workshop receives its actual slug and already composes tool notes/binders; an early return for the new sheet is feasible. The host incoming-connection panel is limited to Living/Café/Post, so Workshop needs no held-app exception. Plain Cartographer invitation/return does not require changing A/B maps or source-job semantics. Generic serialization/restore paths preserve optional roots; the acceptance requirement to exercise actual transfer/explorer/save-off and waiting work remains necessary implementation verification, not evidence already obtained here. **Findings: none. Blocking: false.**

## 3. Scope and overlap — a distinct learner action

Post Office's named-place flights already establish finite sequence/revision, and Instructions provides a manual cursor over up to three unique scene actions. Neither represents a repeated action group. Cartographer counts adjacent intervals and preserves A/B lists but immediately evaluates flat routes. Saving only ENENEN would not retain the composed two-arrow bracket/count.

A separate optional record is proportionate to that difference. It reuses the original setting, coordinate model and pure mathematics while avoiding new semantics in old fields. The four deliveries do not borrow existing job IDs requiring a collection stop. No arbitrary language, nesting, relative turns, forever loops, variables, selection, rewards or new act-completion machinery is needed. The result is a small programming mode, not another supplied text-answer quiz. **Findings: none. Blocking: false.**

## 4. Project commitments and evidence boundary

The most dangerous boundary is **silently replacing recorded evidence with freshly computed mathematical truth**. The revised spec defends it mechanically: own-source labels and source snapshots survive; historical paths/outcomes/counts are shape-admitted; live cursor validity is checked separately; missing current visits do not fall back to another round; unsafe allocation refuses before eviction. In particular an inconsistent historical check must not be redrawn or relabelled as today's recomputed result. Implementation review should check that Kept uses recorded fields.

Support is explicitly requested and relevant to the current check; inspecting a supplied map is presentation. Expansion reveals supplied program information without running it, and a passing supplied trace does not become independent prediction, counting, writing or broad programming evidence. The local, synthetic, open-destination scope is consistent with project privacy and access commitments. **No additional finding. Blocking: false.**

## 5. Mechanical validation — finite arithmetic independently checked

A separate temporary arithmetic oracle used explicit coordinate deltas and boundary tests, then compared with the actual pure walker. It checked **128 complete programs and650 valid begun cursor states**, including cursor0 and the first blocked attempt. All agreed. This validates the proposed mathematics/helper fit, not a future implementation.

| Job | Every fitting completed block/count | Fitting | Blocked | Finished elsewhere |
|---|---|---:|---:|---:|
| sign-out |EN×2, NE×2|2|18|12|
| flowers-out |EN×3, NE×3|2|18|12|
| sign-back |WS×2, SW×2|2|14|16|
| basket-back |WS×3, SW×3|2|18|12|

There are8 fitting,68 blocked and52 completed-wrong-endpoint programs. Across four maps, the nullable selector grammar also contains **172 incomplete programs**. Adding128 complete-but-unstarted states and650 valid begun states gives **950 distinct live program/run combinations** before support/history variants. These counts offer a small exhaustive implementation oracle without any model grader or external service.

The blocked example is exact: WN×3 from`(1,1)` travels to`(0,1)`, then`(0,2)`, attempts command3 and stops. At that point proposed=6, attempted=3, travelled=2; the blocked pointer is repetition2/arrow1. Cursor4 must refuse as live work. EN×3 on sign-out reaches its target`(3,3)` at cursor4 but still has two commands left: delivery remains unobserved there and becomes false at final`(4,4)`. The spec explicitly prevents premature delivery.

The finished-pointer exception avoids inventing repetition3 after a four-move plan. Before a run there is no active pointer; Begin with a complete plan gives cursor0, next repetition1/arrow1. Null/incomplete Begin refuses. All of these are deterministic, light checks. **No additional finding. Blocking: false.**

## 6. Adversarial content, source scope and phone use

The hostile case was the impossible order-repair request, now repaired above. Further useful probes are explicit: EEE NNN reaches the same larger target/count but cannot be substituted as the bracket's expansion; an earlier bounded historical count2/cursor6 remains recorded while current count2/cursor6 is raw; a source with renamed roles/directions and start`(0,0)`/target`(4,0)` can be feasible through EE×2, whereas target`(1,0)` cannot be reached by any complete4/6-step proposal and must stay raw. Source feasibility therefore comes from all32 proposals, not current-case equality or a recognizable title.

The source adjudication is correct. Refreshed upstream has dedicated loop/repeat topics; the older21-topic inventory cannot support a current no-loop claim. Audit71's fresh five-node union and existing two-node closure are explicitly distinguished. The spec retains the resolvable pinned partial Step-by-Step anchor, documents the new unvendored nodes as design references and does not manufacture runtime/atlas coverage. This is original app content about an established programming concept. No full forever/branching/Scratch/device curriculum or educational-effect claim follows.

Four open pages separate map inspection, block composition, execution and kept work. The active Trace turn contains one compact grid and the actual program/cursor/controls, with optional expansion/help afterward. This is a feasible native-phone design: two direction selectors, a finite count choice, one-step execution and explicit revision. It remains a design judgment until actual diagrams and ordinary turn lengths are inspected. The spec requires all four maps/keys, bracket/highlight/path states, blocked/unfinished/finished/future text and opened global voice controls to be checked at320/390/820/1440. Those are appropriate concrete acceptance risks; no screenshot, artwork, phone fit, audible quality or physical-device result is claimed by this review. **No unresolved finding. Blocking: false.**

The builder may proceed on the revised spec. The two P2s above are resolved requirements, not deferred implementation guesses. Independent implementation/content/art review and root's actual browser verification remain required before a local draft PR; nothing here authorizes merge or deployment.
