"""Willowbank landing — Sol's editable, deliberately graphic Blender study.
Run: blender --background --python scene.py [-- --preview]
No external textures, fonts, add-ons, or downloads.
"""
import bpy, math, random, sys
from pathlib import Path
from mathutils import Vector
random.seed(23)
OUT = Path(__file__).resolve().parent
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
for c in list(bpy.data.collections):
    if c.name != 'Collection': bpy.data.collections.remove(c)
def collection(name):
    c=bpy.data.collections.new(name); bpy.context.scene.collection.children.link(c); return c
C=collection('01 • River & bank')
def put(o,name,mat):
    o.name=name
    for c in list(o.users_collection): c.objects.unlink(o)
    C.objects.link(o)
    o.data.materials.append(mat); return o
def material(name,h):
    rgb=[int(h[i:i+2],16)/255 for i in (1,3,5)]
    rgb=[v/12.92 if v<.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
    m=bpy.data.materials.new(name); m.diffuse_color=(*rgb,1); m.use_nodes=True
    n=m.node_tree.nodes; n.clear(); e=n.new('ShaderNodeEmission'); e.inputs[0].default_value=(*rgb,1)
    m.node_tree.links.new(e.outputs[0],n.new('ShaderNodeOutputMaterial').inputs['Surface']); return m
ink=material('01 Ink · #183f39','#183f39')
green=material('02 Willow · #397958','#397958')
sage=material('03 Sage · #d1e3cb','#d1e3cb')
mint=material('04 Mint · #eaf4ef','#eaf4ef')
cream=material('05 Cream · #f4e5bd','#f4e5bd')
ochre=material('06 Ochre · #e9b84a','#e9b84a')
rose=material('07 Rose · #da8d8d','#da8d8d')
wood=material('08 Wood · #b69068','#b69068')
river=material('09 River · #78b7cf','#78b7cf')
blue=material('10 Window blue · #abc4da','#abc4da')
paper=material('11 Paper · #fffdf6','#fffdf6')
darkwood=material('12 Timber shadow','#846d50')
leaflight=material('13 Willow light','#78a78c')
bankshade=material('14 Bank shade','#a7bda1')
watershade=material('15 River shade','#639eae')
roofshadow=material('16 Roof shadow','#b66f75')
def mesh(name,verts,faces,mat):
    me=bpy.data.meshes.new(name); me.from_pydata(verts,[],faces); me.update()
    o=bpy.data.objects.new(name,me); C.objects.link(o); o.data.materials.append(mat); return o
def poly(name,pts,z,mat): return mesh(name,[(x,y,z) for x,y in pts],[tuple(range(len(pts)))],mat)
def cube(name,loc,size,mat,bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object; o.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); put(o,name,mat)
    if bevel: b=o.modifiers.new('Small softened edges','BEVEL'); b.width=bevel; b.segments=2
    return o
def cyl(name,loc,r,depth,mat,vertices=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=loc)
    return put(bpy.context.object,name,mat)
def ball(name,loc,scale,mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=12,location=loc); o=put(bpy.context.object,name,mat); o.scale=scale
    for p in o.data.polygons: p.use_smooth=True
    return o
def line(name,pts,r,mat,cyclic=False):
    cu=bpy.data.curves.new(name,'CURVE'); cu.dimensions='3D'; cu.resolution_u=2; cu.bevel_depth=r; cu.bevel_resolution=2
    s=cu.splines.new('POLY'); s.points.add(len(pts)-1)
    for p,v in zip(s.points,pts): p.co=(*v,1)
    s.use_cyclic_u=cyclic
    o=bpy.data.objects.new(name,cu); C.objects.link(o); cu.materials.append(mat); return o
def smoothline(name,pts,r,mat):
    cu=bpy.data.curves.new(name,'CURVE'); cu.dimensions='3D'; cu.resolution_u=16; cu.bevel_depth=r; cu.bevel_resolution=3
    s=cu.splines.new('BEZIER'); s.bezier_points.add(len(pts)-1)
    for p,v in zip(s.bezier_points,pts): p.co=v; p.handle_left_type='AUTO'; p.handle_right_type='AUTO'
    o=bpy.data.objects.new(name,cu); C.objects.link(o); cu.materials.append(mat); return o
def beam(name,a,b,r,mat): return line(name,[a,b],r,mat)
def ring(name,center,r,thick,mat,axis='Z'):
    pts=[]
    for i in range(64):
        a=2*math.pi*i/64; x,y,z=center
        if axis=='X': pts.append((x,y+r*math.cos(a),z+r*math.sin(a)))
        elif axis=='Y': pts.append((x+r*math.cos(a),y,z+r*math.sin(a)))
        else: pts.append((x+r*math.cos(a),y+r*math.sin(a),z))
    return line(name,pts,thick,mat,True)
def leaf(name,a,b,width,mat):
    a,b=Vector(a),Vector(b); d=b-a; side=Vector((d.z,0,-d.x)).normalized()*width
    mid=a+d*.48
    return mesh(name,[a,mid+side,b,mid-side],[(0,1,2,3)],mat)
# The river continues beyond the frame; the bank is a drawn contour, not a base slab.
poly('River surface',[(-40,-40),(40,-40),(40,40),(-40,40)],0,river)
shore=[(-20,-.2),(-9,-.2),(-7,.35),(-5,1.0),(-3,.85),(-1,.5),(1,.45),(3.55,.4),(3.7,3.6),(4.8,3.6),(5.1,.6),(6.4,.5),(8,1.1),(20,1.4)]
poly('Continuous riverbank',shore+[(20,25),(-20,25)],.19,sage)
line('Fine bank edge',[(x,y,.2) for x,y in shore],.023,ink)
# Simple ink-free contact shapes keep all cast shadows restrained and deliberate.
poly('Mill contact shadow',[(.1,.7),(3.65,.7),(3.65,3.4),(.1,3.4)],.205,bankshade)
poly('Punt reflection',[(-4.1,-3.9),(-3.6,-4.25),(.45,-4.0),(1.1,-3.2),(-.3,-2.6),(-3.3,-2.7)],.012,watershade)
for i,(x,y,l) in enumerate([(-5.3,-3.9,1.0),(-4.3,-1.1,.7),(-1.7,-5.4,1.4),(1.7,-4.8,1.0),(4.6,-3.7,1.4),(5.7,-1.1,.9),(2.4,-5.7,.45),(-6.6,-2.2,.55)]):
    smoothline('Quiet river dash %02d'%i,[(x,y,.025),(x+l*.5,y+.045,.025),(x+l,y,.025)],.019,mint)
    if i in (0,2,4): line('Companion river dash',[(x+.15,y-.18,.025),(x+l*.6,y-.18,.025)],.013,watershade)
# Mill architecture, genuinely pitched gable and a side channel carrying the wheel.
C=collection('02 • Mill house')
cube('Stone plinth',(2.0,2.05,.38),(3.25,2.7,.37),darkwood)
gable=[(.45,.5),(3.55,.5),(3.55,3.3),(2,4.55),(.45,3.3)]
mesh('Continuous plaster walls & gables',[(x,y,z) for y in (.75,3.35) for x,z in gable],[(4,3,2,1,0),(5,6,7,8,9)]+[(i,(i+1)%5,(i+1)%5+5,i+5) for i in range(5)],cream)
# Pitched roof ridge runs back from river-facing gable.
mesh('Rose roof · left slope',[(.16,.43,3.3),(2,.43,4.63),(2,3.65,4.63),(.16,3.65,3.3)],[(0,1,2,3)],rose)
mesh('Rose roof · shaded slope',[(2,.43,4.63),(3.84,.43,3.3),(3.84,3.65,3.3),(2,3.65,4.63)],[(0,1,2,3)],roofshadow)
for a,b in [((.16,.43,3.3),(2,.43,4.63)),((2,.43,4.63),(3.84,.43,3.3)),((2,.43,4.63),(2,3.65,4.63)),((3.84,.43,3.3),(3.84,3.65,3.3))]: beam('Roof ink fascia',a,b,.045,ink)
# Bottom follows the roof plane, so no buried cube edge projects through the roof.
chimneyxy=[(2.585,2.45),(3.015,2.45),(3.015,2.95),(2.585,2.95)]
mesh('Chimney fitted to roof',[(x,y,4.63-(x-2)*1.33/1.84+.005) for x,y in chimneyxy]+[(x,y,4.60) for x,y in chimneyxy],[(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7),(4,5,6,7)],cream)
cube('Chimney cap',(2.8,2.7,4.62),(.58,.63,.13),darkwood)
# Exposed corner posts, sill and modest door.
for x in (.48,3.52): cube('Front corner timber',(x,.72,1.87),(.10,.08,2.82),darkwood)
cube('Front sill',(2,.70,.6),(3.08,.11,.14),darkwood)
cube('Green door ink surround',(1.15,.687,1.4),(.84,.09,1.7),ink,.025)
cube('Green door',(1.15,.625,1.4),(.71,.05,1.58),green,.015)
line('Door board seam',[(1.15,.591,.65),(1.15,.591,2.12)],.011,ink)
ball('Door brass latch',(1.4,.57,1.39),(.035,.025,.035),ochre)
cube('Doorstep',(1.15,.42,.49),(1.06,.53,.15),paper,.025)
def window(x,z,w=.8,h=.95,y=.675):
    cube('Window ink surround',(x,y,z),(w+.12,.09,h+.12),ink,.035)
    cube('Window blue glass',(x,y-.06,z),(w,.04,h),blue,.02)
    cube('Window mullion',(x,y-.086,z),(.045,.035,h),cream)
    cube('Window crossbar',(x,y-.086,z),(w,.035,.045),cream)
    cube('Window sill',(x,y-.11,z-h/2-.1),(w+.22,.25,.09),darkwood,.015)
window(2.64,2.03)
# Small gable vent as a functional focal detail, no symbol or text.
o=cyl('Round gable vent',(2,.67,3.57),.25,.07,ink,40); o.rotation_euler[0]=math.pi/2
o=cyl('Vent inset',(2,.62,3.57),.19,.08,blue,40); o.rotation_euler[0]=math.pi/2
beam('Vent upright',(2,.57,3.4),(2,.57,3.74),.02,cream)
beam('Vent horizontal',(1.83,.57,3.57),(2.17,.57,3.57),.02,cream)
cube('Windowbox',(2.64,.43,1.43),(.95,.32,.25),rose,.025)
for x in (2.28,2.53,2.78,3.0):
    leaf('Window herb',(x,.43,1.54),(x-.13,.43,1.9),.09,green)
    leaf('Window herb',(x,.44,1.54),(x+.14,.44,1.8),.08,green)
    ball('Small ochre bloom',(x,.42,1.87),(.055,.04,.055),ochre)
# Large wheel, axle fixed into the side wall; bottom paddles enter its channel.
C=collection('03 • Working wheel & channel')
cube('Rear channel stone sill',(4.25,3.5,.12),(1.0,.22,.22),darkwood,.04)
radius=1.12
beam('Axle fixed to mill',(3.45,1.9,1.05),(4.43,1.9,1.05),.10,darkwood)
for x in (3.82,4.23):
    ring('Wheel timber rim',(x,1.9,1.05),radius,.065,darkwood,'X')
    for i in range(8):
        a=math.tau*i/8
        beam('Wheel radial spoke',(x,1.9,1.05),(x,1.9+radius*math.cos(a),1.05+radius*math.sin(a)),.038,wood)
for i in range(16):
    a=math.tau*i/16; y=1.9+radius*math.cos(a); z=1.05+radius*math.sin(a)
    o=cube('Waterwheel paddle %02d'%i,(4.025,y,z),(.56,.27,.10),wood)
    o.rotation_euler[0]=a-math.pi/2
o=cyl('Wheel outer hub',(4.31,1.9,1.05),.19,.15,ochre,24); o.rotation_euler[1]=math.pi/2
for x,y in [(4.3,.4),(4.4,.1),(4.6,-.1)]: smoothline('Channel ripple',[(x-.25,y,.03),(x,y-.05,.03),(x+.22,y,.03)],.015,mint)
# Landing deck: parallel boards, rounded post tops, visible piles entering water.
C=collection('04 • Landing & mooring')
cube('Deck bearer',(-.5,-1.5,.31),(4.8,2.2,.19),darkwood)
for i in range(13):
    x=-2.7+i*.365
    cube('Landing board %02d'%i,(x,-1.5,.44),(.345,2.2,.12),wood,.018)
    for y in (-2.45,-.58): cyl('Recessed deck peg',(x,y,.505),.018,.006,ink,10)
for x,y in [(-2.68,-2.48),(1.58,-2.48),(-2.68,-.55),(1.58,-.55)]:
    cyl('Landing pile',(x,y,.18),.11,1.1,darkwood)
    cyl('Pile endgrain',(x,y,.75),.12,.08,cream)
cube('Approach boardwalk',(.85,.06,.38),(1.3,1.03,.18),wood)
for y in (-.33,-.08,.17,.42): cube('Approach board joint',(.85,y,.48),(1.32,.018,.009),darkwood)
# Unnumbered gauge: small, legible, to the side of the goods.
cube('Flood post',(1.85,-1.85,1.0),(.19,.2,2.15),darkwood,.015)
cube('Flood post cream face',(1.85,-1.96,1.1),(.14,.015,1.54),cream)
for i in range(6): cube('Unnumbered gauge tick',(1.82,-1.978,.48+i*.23),(.09 if i%2==0 else .055,.015,.027),ink)
cube('Flood post cap',(1.85,-1.85,2.1),(.29,.30,.09),green,.02)
# Wide working punt. Separate inner/outer hulls yield an open, believable interior.
C=collection('05 • Wide flat punt')
cx,cy=-1.0,-3.5; ang=-.12
def boat(v):
    x,y,z=v; return (cx+x*math.cos(ang)-y*math.sin(ang),cy+x*math.sin(ang)+y*math.cos(ang),z)
outline=[(-2.25,-.62),(1.65,-.62),(2.25,-.34),(2.45,0),(2.25,.34),(1.65,.62),(-2.25,.62),(-2.48,.30),(-2.48,-.30)]
bottom=[(x*.94,y*.84,.14) for x,y in outline]; top=[(x,y,.62) for x,y in outline]
n=len(outline)
mesh('Punt outer hull',[boat(v) for v in bottom+top],[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]+[tuple(range(n-1,-1,-1))],wood)
inner=[(x*.97,y*.87,.59) for x,y in outline]
floor=[(x*.9,y*.77,.26) for x,y in outline]
mesh('Dark open punt interior',[boat(v) for v in inner+floor],[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]+[tuple(range(n,2*n))],darkwood)
line('Punt gunwale',[boat(v) for v in top],.05,ink,True)
line('Punt inner wood rim',[boat((x*.977,y*.91,.633)) for x,y in outline],.025,cream,True)
for y in (-.33,-.11,.11,.33): line('Punt floorboards',[boat((-2.0,y,.28)),boat((1.65,y,.28))],.012,wood)
for x in (-1.5,.95):
    o=cube('Punt bench',boat((x,0,.54)),(.30,1.05,.09),cream,.015); o.rotation_euler[2]=ang
# A single oar rests across both gunwales.
beam('Oar shaft',boat((-.9,-.91,.72)),boat((1.25,.76,.72)),.032,darkwood)
o=ball('Oar blade',boat((1.48,.94,.72)),(.45,.13,.035),wood); o.rotation_euler[2]=.68+ang
smoothline('Mooring rope',[boat((1.95,.4,.64)),(.75,-2.6,.62),(1.58,-2.48,.80)],.022,cream)
for r in (.18,.135,.09): ring('Coiled rope on landing',(-2.15,-1.97,.53),r,.018,cream)
# Carefully grouped small goods, not a grid of identical props.
C=collection('06 • Landing goods')
def basket(name,x,y,r,h):
    z=.51; N=24
    vs=[(x+rr*math.cos(math.tau*i/N),y+rr*math.sin(math.tau*i/N),zz) for rr,zz in [(r*.78,z),(r,z+h),(r*.84,z+h-.025),(r*.65,z+.06)] for i in range(N)]
    fs=[(j*N+i,j*N+(i+1)%N,(j+1)*N+(i+1)%N,(j+1)*N+i) for j in range(3) for i in range(N)]
    mesh(name+' woven shell',vs,fs,wood)
    cyl(name+' dark inside',(x,y,z+.06),r*.65,.02,darkwood)
    for dz in (.10,.22,.34):
        if dz<h-.02: ring(name+' horizontal weave',(x,y,z+dz),r*(.78+.22*dz/h),.014,darkwood)
    ring(name+' rolled rim',(x,y,z+h),r,.025,cream)
    for i in range(12):
        a=math.tau*i/12
        beam(name+' reed upright',(x+r*.79*math.cos(a),y+r*.79*math.sin(a),z+.03),(x+r*math.cos(a),y+r*math.sin(a),z+h-.03),.009,darkwood)
    smoothline(name+' handle',[(x-r*.85,y,z+h-.02),(x-r*.5,y,z+h+.37),(x+r*.5,y,z+h+.37),(x+r*.85,y,z+h-.02)],.025,darkwood)
basket('Large reed basket',-1.95,-.88,.39,.48)
basket('Small reed basket',-1.11,-.72,.29,.37)
# Low crate, genuinely open slats and visible fruit.
x,y=-.10,-.92
cube('Crate floor',(x,y,.55),(.96,.73,.08),darkwood)
for xx in (-.53,.33):
    for yy in (-1.23,-.61): cube('Crate upright',(xx,yy,.78),(.06,.06,.53),darkwood)
for z in (.64,.83,1.02):
    for yy in (-1.25,-.59): cube('Crate long slat',(x,yy,z),(.98,.055,.13),wood,.008)
    for xx in (-.56,.36): cube('Crate end slat',(xx,y,z),(.055,.71,.13),wood,.008)
for i,(xx,yy) in enumerate([(-.37,-1.07),(-.05,-1.07),(.22,-1.05),(-.24,-.78),(.1,-.77)]):
    ball('Rose apple %02d'%i,(xx,yy,1.03),(.145,.14,.14),rose)
    beam('Apple stalk',(xx,yy,1.15),(xx+.01,yy,1.21),.014,darkwood)
    leaf('Apple leaf',(xx,yy,1.19),(xx+.12,yy,1.24),.035,green)
# Honey with paper lid, blank label and tied wrapping.
cyl('Ochre honey jar',(-1.20,-1.82,.76),.21,.48,ochre,32)
cube('Blank honey label',(-1.20,-2.018,.77),(.26,.025,.20),cream,.025)
cyl('Honey paper lid',(-1.20,-1.82,1.02),.245,.09,paper,32)
ring('Honey lid cord',(-1.20,-1.82,.99),.235,.016,darkwood)
# Wrapped seedling parcel with soil visible in three pots.
cube('Wrapped seedling parcel',(.22,-1.87,.66),(.92,.58,.31),cream,.025)
for xx in (-.03,.23,.48):
    cyl('Seedling soil',(xx,-1.87,.83),.10,.03,darkwood,16)
    beam('Seedling stem',(xx,-1.87,.84),(xx,-1.87,1.25),.014,green)
    leaf('Seedling left leaf',(xx,-1.87,1.02),(xx-.19,-1.87,1.19),.075,green)
    leaf('Seedling right leaf',(xx,-1.87,1.12),(xx+.19,-1.87,1.28),.08,green)
line('Parcel string',[(-.23,-2.17,.7),(.67,-2.17,.7)],.014,darkwood)
# Willow: a single asymmetric silhouette with visible branching and pendant leaves.
C=collection('07 • Willow tree')
smoothline('Willow trunk',[(-4.7,2,.20),(-4.55,2,1.6),(-4.7,2.1,2.8),(-4.1,2.15,4.6)],.19,darkwood)
smoothline('Willow left branch',[(-4.6,2,2.0),(-5.3,2.05,3.0),(-5.7,2.15,4.1)],.09,darkwood)
smoothline('Willow right branch',[(-4.6,2,2.7),(-3.8,2,3.25),(-2.9,2.1,4.2)],.10,darkwood)
for i,(x,y,z,sx,sy,sz,mat) in enumerate([(-5.25,2.65,4.65,1.6,.7,1.0,leaflight),(-3.7,2.8,4.85,1.8,.65,1.1,leaflight),(-5.75,2.1,4.1,1.0,.65,1.05,green),(-4.65,2.05,4.5,1.45,.8,1.25,green),(-3.1,2.15,4.35,1.1,.65,1.1,green),(-2.35,2.4,4.2,.75,.5,.85,green)]):
    ball('Willow canopy mass %02d'%i,(x,y,z),(sx,sy,sz),mat)
for i in range(17):
    x=-6.05+i*.24; z=4.0+.5*math.sin(i*.47); y=1.52+.06*math.cos(i)
    endz=z-random.uniform(.7,1.45)
    smoothline('Willow pendant branch %02d'%i,[(x,y,z),(x+.03,y-.03,(z+endz)*.5),(x+.10,y-.04,endz)],.012,ink)
    for j in range(3):
        zz=z-(z-endz)*(.25+j*.23)
        leaf('Pendant willow leaf',(x+.02,y-.05,zz),(x+(.17 if j%2 else -.12),y-.06,zz-.35),.047,leaflight if i%3==0 else green)
# Scale the tree around its foot, keeping the entire crown comfortably in frame.
treebase=Vector((-4.7,2,.2))
for o in list(C.objects):
    if o.type=='MESH':
        for v in o.data.vertices:
            world=o.matrix_world@v.co; v.co=o.matrix_world.inverted()@(treebase+(world-treebase)*.84)
    elif o.type=='CURVE':
        o.data.bevel_depth*=.84
        for s in o.data.splines:
            if s.type=='BEZIER':
                for p in s.bezier_points:
                    for attr in ('co','handle_left','handle_right'):
                        setattr(p,attr,treebase+(getattr(p,attr)-treebase)*.84)
            else:
                for p in s.points: p.co=(*(treebase+(Vector(p.co[:3])-treebase)*.84),1)
poly('Willow rooted grass patch',[(-5.35,1.75),(-5.0,1.55),(-4.5,1.58),(-4.06,1.9),(-4.15,2.25),(-4.8,2.39),(-5.36,2.15)],.215,bankshade)
for dx,dy in [(-.51,-.12),(.42,-.22),(.25,.21)]:
    smoothline('Exposed willow root',[(-4.7,2,.30),(-4.7+dx*.5,2+dy*.5,.235),(-4.7+dx,2+dy,.23)],.043,darkwood)
for x,y in [(-5.12,1.74),(-4.23,2.0),(-4.42,1.64)]:
    leaf('Root grass',(x,y,.22),(x-.1,y,.47),.05,green)
    leaf('Root grass',(x,y,.22),(x+.11,y,.40),.05,green)
# The path is an irregular pale strip with no route or map information.
C=collection('08 • Bank plants & stones')
poly('Worn landing approach',[(-.15,.59),(.15,1.0),(.51,1.12),(1.7,1.15),(1.88,.8),(1.55,.54)],.215,cream)
for x,y,s in [(-3,.64,.26),(-3.6,.51,.20),(5.25,.7,.30),(5.65,.58,.22),(-5.1,.26,.2)]:
    ball('Rounded bank stone',(x,y,.25),(s,s*.7,s*.42),bankshade)
def reedclump(x,y,h,count=6):
    for i in range(count):
        xx=x+random.uniform(-.26,.26); yy=y+random.uniform(-.13,.13); hh=h*random.uniform(.65,1.1)
        lean=random.uniform(-.25,.25)
        smoothline('Reed stem',[(xx,yy,.13),(xx+lean*.4,yy,hh*.6),(xx+lean,yy,hh)],.013,green)
        leaf('Long reed blade',(xx,yy,.15),(xx+random.choice([-1,1])*.35,yy,hh*.82),.065,green)
        if i%2==0: ball('Reed seed head',(xx+lean,yy,hh),(.042,.042,.14),darkwood)
reedclump(-4.8,-.0,1.05,7); reedclump(-5.8,-.1,.8,5)
reedclump(5.3,.12,1.0,7); reedclump(6.1,.3,.75,5)
reedclump(3.2,-4.9,.9,5)
for x,y in [(-3.5,1.0),(-3.15,1.16),(-3.7,1.2),(5.6,1.3),(5.9,1.45)]:
    beam('Meadow stem',(x,y,.2),(x,y,.56),.012,green)
    ball('Meadow ochre flower',(x,y,.59),(.065,.05,.065),ochre)
# Graphic illustration rendering: literal palette, no glossy lighting, no noise.
C=collection('09 • Camera')
bpy.ops.object.camera_add(location=(10,-18,13)); cam=bpy.context.object
cam.name='Illustration · orthographic'; cam.rotation_euler=(Vector((.1,.25,1.8))-cam.location).to_track_quat('-Z','Y').to_euler()
cam.data.type='ORTHO'; cam.data.ortho_scale=14.8; bpy.context.scene.camera=cam
sc=bpy.context.scene; sc.render.engine='CYCLES'; sc.cycles.samples=32; sc.cycles.use_denoising=False
sc.render.resolution_x=1800; sc.render.resolution_y=1350; sc.render.resolution_percentage=60 if '--preview' in sys.argv else 100
sc.render.image_settings.file_format='PNG'; sc.render.filepath='//willowbank-landing-sol.png'
sc.view_settings.view_transform='Standard'; sc.view_settings.look='None'; sc.view_settings.exposure=0; sc.view_settings.gamma=1
sc.world.color=(.8,.8,.8); sc.render.film_transparent=False
sc.render.use_freestyle=True; sc.render.line_thickness=1.0
ls=sc.view_layers[0].freestyle_settings.linesets[0]
ls.linestyle.color=(.0091,.0497,.0413); ls.linestyle.thickness=2.2
ls.select_crease=False; ls.select_silhouette=True; ls.select_border=True; ls.select_contour=True
sc.render.use_file_extension=True
# Group visibility and camera are saved for direct editing and reproducibility.
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'willowbank-landing-sol.blend'))
bpy.ops.render.render(write_still=True)
