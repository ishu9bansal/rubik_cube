var edge = ndArray(2);
var corner = ndArray(3);
var resolution = 50;
var svg;
var width;
var height;

function isValid(){
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
	logCube();
}

init();
