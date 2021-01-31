var edge = ndArray(2);
var corner = ndArray(3);
var resolution = 50;
var svg;
var width;
var height;
const colors = ["blue", "red", "green", "orange", "white", "yellow"];

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
	colour = "BRGOWY";
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
	svg.selectAll(".square")
	.transition().duration(250)
	.style("fill", function(d) {
		k = 0;
		if(d.k.length==3)	k = corner[d.k[0]][d.k[1]][d.k[2]];
		else if(d.k.length==2)	k = edge[d.k[0]][d.k[1]];
		else	k = d.k[0];
		return colors[k];
	});
}

function init(){
	width = window.innerWidth;
	height = window.innerHeight;
	resolution = Math.floor(Math.min(width/17,height/13));
	svg = d3.select("svg").attr("width", resolution*17).attr("height", resolution*13);
	svg.selectAll(".square").data(map)
	.enter().append("rect")
	.attr("class","square")
	.attr("width", resolution)
	.attr("height", resolution)
	.attr("x", function(d) {
		return resolution*(1+d.j);
	})
	.attr("y", function(d) {
		return resolution*(1+d.i);
	})
	.style("stroke", "black")
	.style("fill","white");

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
}
