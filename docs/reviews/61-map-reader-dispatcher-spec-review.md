# Map Reader / Dispatcher: independent specification and content review

**Verdict: BUILD-READY. No P1/P2 findings; no P3 changes requested.**

A separate reviewer context inspected spec61, source audit61, audit58, repository instructions, and the actual Cartographer content/core/UI, Workshop routing, notes and transfer seams. The review covers the complete original content and the bounded extension before implementation. No runtime61 implementation or browser behavior is claimed.

## Complete content and route review

The four supplied coordinates form a three-interval square: Post Office (1,1), Bridge (4,1), Café (4,4), Garden (1,4). The map-reader wording correctly reads across then up, uses north/up and east/right, and describes adjacent point intervals rather than covered plots. Six labelled coordinates 0–5 span five intervals; model metres do not imply physical map scale.

All three dispatcher requests and both equal-length arrival alternatives were checked against that geometry:

| Job | Serves request in six moves | Arrives in six moves but misses required stop |
| --- | --- | --- |
| Sign: Post → Bridge → Café | EEE NNN | NNN EEE, via Garden |
| Flowers: Post → Garden → Café | NNN EEE | EEE NNN, via Bridge |
| Notice: Garden → Post → Bridge | SSS EEE | EEE SSS, via Café |

The twelve-command sign route NNN EEE SSS NNN visits Café at index6, Bridge at index9, then Café at final index12. It therefore serves the explicitly stated completion-time delivery rule. Passing the destination before collecting the sign is permitted. The specification correctly avoids solution matching, shortest-path requirements and terminating execution at the first destination visit.

The required-stop rule, clarified by the targeted fold below, inspects actually travelled points: any reached required-stop point counts as visited, with its first index recorded. Fulfilment additionally requires that visit before the final travelled point, completing every command without a block, and finishing at the requested destination. Thus a blocked prefix, an intended untravelled suffix, adjacency, or arrival alone cannot establish service. Detours and retracing remain acceptable within twelve commands; each travelled interval counts. Empty routes do not serve any supplied job because the three role endpoints are distinct.

## Experience, source limits and integration

The new distinction changes what a route must accomplish: equally long routes with the same endpoint can differ in serving the request. Existing native route authorship and repair remain the learner action. The Map/Route/Compare seam, ordinary new-sheet operation, shared map history and optional round.job are sufficient; no second game shell, typed exchange, source registry or partner service is needed.

The three convenience views are freely revealable, default to both clues, preserve drafts and permit complete solo play. Their visibility is not an information-security boundary, assistance penalty or evidence of a partner's participation. The spec does not turn optional speech/signing/AAC/discussion into an observed communication skill. Source mappings retain the narrow coordinate/route/unit meanings and their explicit exceptions, without adding broad listening, cooperation, computing or learning-effect claims.

The ordinary free map remains available. Supplied job positions/endpoints are fixed only on that job sheet; commands remain editable. A new job allocates one sheet rather than replacing a current map or performing a second eviction. The existing capacity, raw-sibling, ID and failure rules are carried forward explicitly, including disclosure before the action and nonmutating allocation failure.

## Saved work and implementation gates

Live sheet agreement with its own frozen job source is a necessary input-coherence check, distinct from forbidden historical regrading. New explicit checks freeze the source and preserve arrival, required-stop and service as separate recorded fields. Historical outputs are validated by readable shape/range, not regenerated truth; contradictory recorded booleans remain visible as recorded. Earlier checks without job facts are retained with an explicit limit rather than retroactively awarded service. Role-view changes do not make a route check stale.

A present malformed/future job makes only its sheet read-only in the existing earlier-work path. It cannot silently fall through to ordinary-arrival praise; valid siblings remain available. A future whole envelope stays read-only. Source wording, unknown fields, old route checks, base state and unrelated games retain their stated preservation boundaries.

The existing generic both-arrived message needs a job-specific branch, and both live map-edit mutators need the supplied-job guard; the spec explicitly requires these changes. Focus, current prompts, freely reachable clues, native controls, local narration scope, notes/import/switch/save-off and pure rendering have concrete acceptance gates. They remain implementation and actual browser work, not unresolved specification questions. Independent implementation review remains required before a draft PR; no merge/deployment, physical-device, audible-speech, human communication or learning-effect claim follows from this review.

## Targeted semantic clarification

**Approved:** visited/firstVisit count the required stop anywhere in the actual travelled point list, including its final point. Fulfilled separately requires firstVisit strictly before the final point, all commands completed without a block, and the requested final destination. This supersedes the initial wording that restricted the visit observation itself to an index before the final travelled point.

A blocked prefix ending at Bridge has visited Bridge even though it cannot deliver to Café. Likewise an otherwise complete route ending at the intermediate stop records visited=true and fulfilled=false. An intended stop in an untravelled suffix remains unvisited. Existing completed deliveries, the twelve-command early-destination-pass example and alternate-route acceptance are unchanged. Since source start/stop/destination are distinct, a successful requested delivery already places the intermediate visit before its final destination; retaining that explicit ordering condition makes the completion rule clear.

This fold cleanly separates the observed visit from serving the complete request. Historical outputs remain recorded without regrading. Approval is for the proposed narrow spec/core/test fold; it is not a claim that its implementation or browser behavior has been verified. No runtime or specification file was edited by this reviewer.
