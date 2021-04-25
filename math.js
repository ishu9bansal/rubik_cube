const cos = (t) => Math.cos(t*Math.PI/180);
const sin = (t) => Math.sin(t*Math.PI/180);

function dotProduct(vec1, vec2){
	var r = 0;
	var l = vec1.length;
	for(var i=0; i<l; i++)
		r += vec1[i]*vec2[i];
	return r;
}

function col(mat, i){
	return mat.map(d => d[i]);
}

function row(mat, i){
	return mat[i];
}

function transpose(mat){
	var m = [];
	if(!mat.length)	return m;
	var l = mat[0].length;
	for(var i=0; i<l; i++)
		m.push(col(mat,i));
	return m;
}

function matMultiply(mat1, mat2){
	var r = [];
	if(!mat2.length)	return r;
	for(var i=0; i<mat1.length; i++){
		var temp = []
		for(var j=0; j<mat2[0].length; j++)
			temp.push(dotProduct(row(mat1,i),col(mat2,j)));
		r.push(temp);
	}
	return r;
}

function crossProduct(vec1, vec2){
	return matMultiply(transpose([vec2]),[vec1]);
}

function add(...mat){
	if(!mat.length)	return [];
	var r = mat[0];
	for(var k=1; k<mat.length; k++)
		for(var i=0; i<r.length; i++)
			for(var j=0; j<r[i].length; j++)
				r[i][j] += mat[k][i][j];
	return r;
}

function scalerProduct(s, mat){
	if(!Array.isArray(mat))	return s*mat;
	return mat.map(d => scalerProduct(s,d));
}

function productMatrix3(u,v,w){
	return [
		[0,-w,v],
		[w,0,-u],
		[-v,u,0]
	];
}

function identityMatrix(n){
	var temp = [];
	for(var i=0; i<n; i++)
		temp.push(0);
	var r = [];
	for(var i=0; i<n; i++)
		r.push(temp.flat());
	for(var i=0; i<n; i++)
		r[i][i] = 1;
	return r;
}

function rotationMatrix(u,v,w,t){
	var l = Math.sqrt(u*u+v*v+w*w);
	u /= l;
	v /= l;
	w /= l;
	var c = cos(t);
	var s = sin(t);
	var vec = [u,v,w];
	return add(scalerProduct(c,identityMatrix(3)), scalerProduct(s,productMatrix3(...vec)), scalerProduct(1-c,crossProduct(vec,vec)));
}

function transformationMatrix(u,v,w,t,x=0,y=0,z=0){
	var r = rotationMatrix(u,v,w,t);
	r[0].push(x);
	r[1].push(y);
	r[2].push(z);
	r.push([0,0,0,1]);
	return r;
}

function normalize(vec){
	var l = 0;
	for(var i=0; i<vec.length; i++)
		l += vec[i]*vec[i];
	l = Math.sqrt(l);
	for(var i=0; i<vec.length; i++)
		vec[i] /= l;
	return l;
}

function crossVector3(vec1, vec2){
	var r = productMatrix3(...vec1);
	r = matMultiply(r, transpose([vec2]));
	return col(r,0);
}

function transformationMatrixBySourceTargetVectors(srcVec, tarVec){
	var s = normalize(tarVec)/normalize(srcVec);
	var c = dotProduct(srcVec,tarVec);
	var cross = crossVector3(srcVec, tarVec);
	var r = transformationMatrix(...cross,Math.acos(c)*180/Math.PI);
	r[3][3] = s;
	return r;
}
