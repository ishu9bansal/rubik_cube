var edge = ndArray(2);
var corner = ndArray(3);
var resolution = 50;
var svg;
var width;
var height;
var face;
const dir = [0,-1,0,1,0];
const DEGPERLEN = 1;
const colors = ["blue", "red", "green", "orange", "white", "yellow"];
const colour = "BRGOWYbrgowy0123456789";
const sides = ["top", "right", "bottom", "left", "front", "back"];
const cubeOpacity = 0.9;
const rotationStepInterval = 50;
var globalMatrix;
var localMatrix;
var mousedownevent;

function isValid(){
	for(var j=0; j<6; j++){
		for(var j=0; j<6; j++){
			for(var k=0; k<6; k++){
				if(corner[i][j][k]!=corner[i][k][j])
					return false;
			}
		}
	}
	return true;
}

function logCube(){
	if(!isValid()){
		console.log("Invalid Cube");
		return;
	}
	s = '\n'
	+'\t'+colour[corner[0][3][5]]+colour[edge[0][5]]+colour[corner[0][1][5]]+'\n'
	+'\t'+colour[edge[0][3]]+colour[0]+colour[edge[0][1]]+'\n'
	+'\t'+colour[corner[0][3][4]]+colour[edge[0][4]]+colour[corner[0][1][4]]+'\n'
	
	+'\n'

	+colour[corner[3][5][0]]+colour[edge[3][0]]+colour[corner[3][4][0]]+'\t'
	+colour[corner[4][3][0]]+colour[edge[4][0]]+colour[corner[4][1][0]]+'\t'
	+colour[corner[1][4][0]]+colour[edge[1][0]]+colour[corner[1][5][0]]+'\t'
	+colour[corner[5][1][0]]+colour[edge[5][0]]+colour[corner[5][3][0]]+'\n'

	+colour[edge[3][5]]+colour[3]+colour[edge[3][4]]+'\t'
	+colour[edge[4][3]]+colour[4]+colour[edge[4][1]]+'\t'
	+colour[edge[1][4]]+colour[1]+colour[edge[1][5]]+'\t'
	+colour[edge[5][1]]+colour[5]+colour[edge[5][3]]+'\n'

	+colour[corner[3][5][2]]+colour[edge[3][2]]+colour[corner[3][4][2]]+'\t'
	+colour[corner[4][3][2]]+colour[edge[4][2]]+colour[corner[4][1][2]]+'\t'
	+colour[corner[1][4][2]]+colour[edge[1][2]]+colour[corner[1][5][2]]+'\t'
	+colour[corner[5][1][2]]+colour[edge[5][2]]+colour[corner[5][3][2]]+'\n'
	
	+'\n'

	+'\t'+colour[corner[2][3][4]]+colour[edge[2][4]]+colour[corner[2][1][4]]+'\n'
	+'\t'+colour[edge[2][3]]+colour[2]+colour[edge[2][1]]+'\n'
	+'\t'+colour[corner[2][3][5]]+colour[edge[2][5]]+colour[corner[2][1][5]]+'\n'

	+'\n';
	console.log(s);
}

function ndArray(k){
	if(!k)	return 0;
	var temp = [];
	for(var i=0; i<6; i++){
		temp.push(ndArray(k-1));
	}
	return temp;
}

function renderCube(){
	d3.selectAll(".square")
	.transition().duration(250)
	.style("fill", function(d) {
		k = 0;
		if(d.k.length==3)	k = corner[d.k[0]][d.k[1]][d.k[2]];
		else if(d.k.length==2)	k = edge[d.k[0]][d.k[1]];
		else	k = d.k[0];
		return colors[k];
	});
}

function handleMouseOver(d,i){
		d3.select(this)
		.transition().duration(100)
		.style("opacity", 1);
}

function handleMouseOut(d,i){
		d3.select(this)
		.transition().duration(100)
		.style("opacity", cubeOpacity);
}

function handleClick(d,i){
		rotate(d.k[0]);
}

function res(multiplier){
	return (multiplier*10)+"vh";
}

function transformation(x,y,z=0){
	var l = Math.sqrt(x*x+y*y+z*z);
	return transformationMatrix(x/l,y/l,z/l,DEGPERLEN*l);
}

function rotateCube(freeze=false){
	var r = matMultiply(localMatrix, globalMatrix);
	d3.select(".cube").style("transform", "matrix3d("+r.flat().join()+")");
	if(freeze){
		globalMatrix = r;
		localMatrix = identityMatrix(4);
	}
}

function onMouseDisplaced(x,y,freeze=false){
	localMatrix = transformation(y,-x);
	rotateCube(freeze);
}

function handleKeyDown(e){
	k = e.which-37;
    if(k<0||k>3)  return;
    onMouseDisplaced(dir[k+1],dir[k],true);
}

function handleMouseMove(e){
	onMouseDisplaced(e.x - mousedownevent.x, e.y - mousedownevent.y);
}

function handleMouseDown(e){
	mousedownevent = e;
	window.onmousemove = handleMouseMove;
}

function handleMouseUp(e){
	window.onmousemove = null;
	rotateCube(true);
}

function init(){
	width = window.innerWidth;
	height = window.innerHeight;
	d3.selectAll("svg")
	.attr("width", res(3))
	.attr("height", res(3))
	.style("opacity", 1);
	face = [];
	for(var i = 0; i < 6; i++){
		d3.select(".cube ."+sides[i]).attr("title", "press "+colour[i]);
		face.push(d3.select(".cube ."+sides[i]+" .face"));
		var subdata = map.filter(d => d.k[0] == i);
		face[i].selectAll(".square")
		.data(subdata).enter()
		.append("rect")
		.attr("class","square")
		.attr("width", res(1))
		.attr("height", res(1))
		.attr("x", d => res(d.j%4))
		.attr("y", d => res(d.i%4))
		.style("stroke", "black")
		.style("fill","white")
		.style("opacity", cubeOpacity)
		.filter(d => d.k.length==1)
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut)
		.on("click", handleClick);
	}

	globalMatrix = localMatrix = identityMatrix(4);
	rotateCube();	// set initial view here

	for(var i=0; i<6; i++){
		for(var j=0; j<6; j++){
			edge[i][j] = i;
			for(var k=0; k<6; k++){
				corner[i][j][k] = i;
				corner[i][k][j] = i;
			}
		}
	}
	renderCube();
	window.onkeypress = handleKeyPress;
	window.onkeydown = handleKeyDown;
	window.onmousedown = handleMouseDown;
	window.onmouseup = handleMouseUp;
}

init();

function adjacent(n){
	v = [0,1,2,3];
	n = n%6;
	if(n==5)	return [3,2,1,0];
	if(n==4)	return v;
	v[0] = 4;
	v[1] = (n+3)%4;
	v[2] = 5;
	v[3] = (n+1)%4;
	return v;
}

function getEdge(i, j){
	return [edge[i][j],edge[j][i]];
}

function getCorner(i, j, k){
	return [corner[i][j][k],corner[j][k][i],corner[k][i][j]];
}

function changeCorner(index, value){
	var j;
	var k;
	for(var i=0; i<3; i++){
		j = (i+1)%3;
		k = (i+2)%3;
		corner[index[i]][index[j]][index[k]] = value[i];
		corner[index[i]][index[k]][index[j]] = value[i];
	}
}

function changeEdge(i, j, v){
	edge[i][j] = v[0];
	edge[j][i] = v[1];
}

function rotate(n, clockwise = false){
	a = adjacent(n);
	if(clockwise){
		var t = a[1];	a[1] = a[3];	a[3] = t;
	}
	var i,j,k;
	for(var o=0; o<3; o++){
		i = a[o];
		j = a[(o+1)%4];
		k = a[(o+2)%4];
		var tempEdge = getEdge(n,i);
		var tempCorner = getCorner(n,i,j);
		changeEdge(n,i,getEdge(n,j));
		changeCorner([n,i,j],getCorner(n,j,k));
		changeEdge(n,j,tempEdge);
		changeCorner([n,j,k],tempCorner);
	}
	renderCube();
}

function handleKeyPress(e){
	n = colour.indexOf(e.key);
	if(n!=-1)	rotate(n%6,n/6);
}
