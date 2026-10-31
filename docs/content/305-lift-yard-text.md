# 305 · The Lift Yard copy

**The Lift Yard** · Eyebrow: “Willowbank · restocking the upper storeroom”. Introduction: “The shops need dry stores after the storm. Choose a ramp, then pull the delivery to the top mark. A longer ramp can need less pull, but more rope.”

**Plan / Pull** · **Yard / Numbers** · **Other deliveries** · **Return to current job**. Jobs wait while you look around this yard. Leaving the yard or reloading starts a fresh shift. Nothing here changes your saved learning notes.

Delivery tags: Café pantry / Library supplies / Garden stores / Lantern supplies / Post Office stores / Mill stores. Each shows “Load weight: {w} N”, “Winch can pull up to {c} N”, “Boards available: {listed lengths} m”, “Top mark: 1 m above the start”. Newtons (N) measure force. These are model equipment limits, not a real lifting plan.

Plan instruction: “Find a ramp that fits this delivery. Sometimes more than one works.” Keys: 2 m / 3 m / 4 m / 6 m. Preview: “{L} m ramp · needs {F} N of steady rope pull”. When unavailable: “Planned board—not supplied for this delivery.” Stock refusal: “This delivery has boards up to {b} m. Choose a supplied board.” Add “Your current trip is still waiting.” only if started. Force refusal: “This ramp needs {F} N. This winch can pull up to {c} N. Try a longer supplied ramp.” If both fail, explain stock first.

Actions: **Start this ramp** / **Continue this trip** / **Start this ramp from the bottom** / **Keep current trip** / **Change plan**. Different draft, only if started: “Your {activeL} m trip waits at {d} m of rope pulled. This preview starts at the bottom.” Before replacing a started trip, only for a valid startable draft: “Starting this ramp ends your waiting {activeL} m trip.” Starting a different ramp keeps the job's previous delivery, if any; the new trip starts at zero.

Pull instruction: “Pull the rope one meter at a time. Watch the load rise.” **Pull rope 1 m** / **Return drum to start**. At the top: “Delivery reached the top mark.” **Next delivery** / **Keep this trip** / **Replace held trip**. Repeating a delivery counts once for the shift. Returning the drum keeps an earlier delivery complete.

Facts: “{Planned trip · rope pulled / Rope pulled}: {d} of {L} m”; “Height gained: {reduced d/L} m”; “Required rope pull: {F} N”; “Rope work so far: {F*d} J”; “Whole trip: {L} m of rope × {F} N = {F*L} J”. At the bottom height is 0 m, at top 1 m. The winch adjusts its pull; its maximum is a limit, not the force used on every ramp.

Numbers title: “A picture of input work”. Axis labels: “Rope distance (m)” and “Required force (N)”. Caption: “Each cell = 1 J. Filled columns show work so far; the rectangles represent force × distance, not square meters.” Yard title: “Sliding delivery on a model ramp”. Description states selected ramp length, fixed one-meter rise, current checkpoint and required pull. Visible scale marks show each meter along the ramp. Required-pull gauge has fixed 0–12 N scale and a separately labelled winch limit.

Held panel: “Held completed ramp trip · {w} N load · {L} m ramp · {F} N along {L} m of rope · {F*L} J whole-trip work”. **Clear held trip**. No held trip: “Keep a completed trip, then try another machine or plan.” Current comparison uses the visible draft while planning, clearly labelled planned even if it cannot fit, and the active ramp while pulling; whole-trip work is shown separately from work so far. Same weight and length: “The load and ramp length are the same.” Same weight, changed length: “Same load and height. The {current planned / current / held} ramp is longer: it needs less pull and more rope. Whole-trip rope work stays the same.” Same length, changed weight: “Same ramp and height. The {current / held} load is heavier: it needs more pull and more whole-trip work.” Both changed: “Both load weight and ramp length changed. Compare the numbers; this does not isolate the effect of ramp length.” A held trip does not prove it fits today's stock or winch.

Shift notice: “All six deliveries reached the top mark. The stores are stocked for this shift!” **Another shift**. “Try another set of deliveries. Your lever jobs, view and held trip stay; these six ramp jobs start fresh.” No credits, time limit, learning score, story ending or mastery claim.

**About this model**: “The drum slides; it does not roll. The rope pulls parallel to the board. We imagine steady movement with no friction or winch losses, and ignore starting and stopping. A holding brake keeps each checkpoint still. Real lifting takes suitable equipment and trained people.”

**Why does the work stay the same?** “For this model, required pull = load weight × height ÷ ramp length. A 12 N load rising 1 m needs 12 J of rope work. On a 2 m ramp it needs 6 N for 2 m; on a 4 m ramp, 3 N for 4 m. The rope's positive work increases gravitational potential energy of the load and Earth. The ramp supports the drum and gravity also acts. With steady motion, all forces on the drum together do zero net work: rope +{F*L} J, gravity −{w*h} J, ramp support 0 J. Its speed stays constant. This is not a speed or power simulation.”

**Hear this turn** reads the current visible tag, instruction and quantities. No hearing, reading, independent attempt or learning result is recorded. **More workshop tables** / **Compare cart landings** lead to existing open destinations. Existing Workshop/Fair Test links are outside these modules and are not transcribed here.

Additional source copy (placeholders represent interpolation):

Local notice: "Jobs wait between yard turns. Leaving the yard or reloading starts a fresh shift. Nothing here changes your saved learning notes."

Plan group: "Ramp length". Replacement append: "Your earlier delivery stays complete." Force preview: "Planned setup—needs more pull than this winch provides." Delivered reminder: "Repeating a delivery counts once. Returning the drum keeps its earlier delivery complete."

Yard caption: "Required pull {F} N · red line: winch limit {c} N. Drawing symbols are not measured equipment." Description: "{L} meter sloping board, one meter rise. {d} meters of rope pulled; height gained {reduced d/L} meter. Required steady rope pull {F} newtons; winch limit {c} newtons. Drum slides, not rolls." Labels: "Meters along the ramp", "Top mark", "{w}N", "1 m", "N"; checkpoints 0 through {L}, gauge ticks 0 / 6 / 12.

Numbers labels: "{Current planned / Current} {ramp / lever} trip", "Held completed {lever / ramp} trip", "{F} N × {L} m = {F*L} J", "Work so far: {F*d} J", "Completed: {held full work} J", "Keep a trip to compare." Description: "Each fixed-size cell represents one joule, from one newton through one meter. {Current planned / Current} {ramp / lever} trip, {vertical push drop / rope distance} {L} meters, {F} rows and {L} columns; {d} columns filled, {F*d} joules so far.{optional held sentence} This represents work, not square meters." Optional held sentence: " Held completed {lever / ramp} trip, {vertical push drop / rope distance} {held distance} meters, {held force} rows and {held distance} filled columns, {held full work} joules."

Held panel accessible label: "Compare completed trip". Heading: "Compare completed trips" or "Held completed {lever / ramp} trip". Caveat: "A held trip does not prove it fits today’s equipment or space." Cross-machine text is in sheet 306.

Jobs chooser: "Six deliveries · {count} reached the top". "Every job is open. Your waiting trips stay where you left them." Tags: "{destination} · {w} N · winch {c} N · boards up to {b} m", optional " · delivery complete" and " · current trip {d} of {L} m rope pulled".

Model note: "Newtons (N) measure force, not mass. The winch adjusts its pull; its maximum is a limit, not the force used on every ramp. These are model equipment limits, not a real lifting plan." Heading: "Grown-ups: sources and limits". Notice: "Supplied teaching, not an assessment or physical experiment. No steps, support requests, reading or hearing results are added to notes." Links: "OpenStax: inclined planes", "simple machines", "work and energy".

Hear this turn: "{destination}. {Current planned ramp / Current ramp}. Load weight {w} newtons. Winch limit {c} newtons. {instruction} {L} meter ramp, required pull {F} newtons. Rope pulled {d} of {L} meters. Height gained {reduced d/L} meter. Rope work so far {F*d} joules." Append a space and held text when held.

Shared groups: "Machine", "View"; buttons: **Ramp / Lever**. The film header here uses "Willowbank · a lifting idea" and "The Lift Yard"; imported film content is outside these sheets.
