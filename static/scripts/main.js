var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

var pur = [];
var comp;
var strkW;

const velocity = 1/200;

$(window).on('load', function() {
	ctx.beginPath();
	ctx.rect(0, 0, w, h);
	ctx.fillStyle = "#333333";
	ctx.fill();
});

function updateLabel() {
	$('#comp-label').html( $('#comp').val() );
	$('#wid-label').html( $('#wid').val() );
}

function distance(a, b) {
	return math.square(a[0] - b[0]) + math.square(a[1] - b[1]);
}

function toRGB(color) {
	if(color.substring(0,1) == '#') {
		color = color.substring(1);
	}

	var rgbColor = [ parseInt(color.substring(0,2),16), parseInt(color.substring(2,4),16), parseInt(color.substring(4),16) ];

	return rgbColor;
}

function aten(x) {
	let atenFactor = 5;
	return 1-math.pow(1-x, atenFactor);
}

function generate() {
	$('#gen-btn').prop('disabled', true);

	let res = $('#res').val();
	w = parseInt( res.split(',')[0] );
	h = parseInt( res.split(',')[1] );

	canvas.width = w;
	canvas.height = h;

	ctx.beginPath();
	ctx.rect(0, 0, w, h);
	ctx.fillStyle = $('#back').val();	
	ctx.fill();
	ctx.closePath();

	let col1 = toRGB( $('#col1').val() );
	let col2 = toRGB( $('#col2').val() );

	comp = parseInt( $('#comp').val() );

	for (let i=0; i < comp; ++i) {
		purs = [
			( Math.random()*w ),
			( Math.random()*h )
		];
		pur.push( purs );
	}

	// let led = [];
	let ledIndex = [];

	for (let i=0; i < comp; ++i) {
		let minK = 0;
		if (i == 0)
			minK = 1;
		let minDist = distance(pur[i], pur[minK]);
		for (let k=1; k < comp; ++k) {
			if (k == i)
				continue;
			let dist = distance(pur[i], pur[k]);
			if (dist < minDist) {
				minK = k;
				dist = minDist;
			}
		}
		// led.push( pur[minK] );
		ledIndex.push( minK );
	}
	
	let colDiff = math.subtract(col2, col1);
	let randCol = []
	for (let i=0; i < comp; ++i) {
		randCol.push( (Math.random() - 0.5)*20 )
	}

	strkW = parseInt( $('#wid').val() );
	var totalIters = 1000;
	for (let j=0; j < totalIters; ++j) {
		let iters = j*1.0/totalIters;
		let ledUpdated = [];
		ledUpdated.length = 0;
		for (let i=0; i < comp; ++i) {
			ledUpdated.push( pur[ ledIndex[i] ] );
		}
		
		let dest = math.subtract(ledUpdated, pur);
		// let trans = math.square( math.transpose( dest ) );
		// let dist = math.sqrt( math.subtract(trans[0], trans[1]) );
		// let norm = math.transpose( [dist, dist] );
		// dest = math.add(math.dotMultiply(math.dotDivide(dest, norm), velocity), pur);
		dest = math.add( math.dotMultiply(dest, velocity), pur);
		
		for (let i=0; i < comp; ++i) {
			ctx.beginPath();
			ctx.strokeStyle = `rgba( ${(col1[0] + iters*colDiff[0] + randCol[i])}, ${(col1[1] + iters*colDiff[1] + randCol[i])}, ${(col1[2] + iters*colDiff[2] + randCol[i])}, ${aten(iters)} )`;			
			ctx.moveTo(pur[i][0], pur[i][1]);
			ctx.lineTo( dest[i][0], dest[i][1] ) ;	
			ctx.lineWidth = strkW;
			ctx.stroke();
			ctx.closePath();
		}

		pur = dest;
	}
}
