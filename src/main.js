import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

import { EffectComposer, RenderPass, EffectPass, SelectiveBloomEffect } from 'postprocessing';


function loadModel(modelName, scale, rotation, position, name){

	let mtlPath = null;
	let objPath = null;

	switch(modelName.slice(0,5)){

		case "board":
			mtlPath = 'src/assets/models/boardMtl/board' + colorScheme.boardColor + '.mtl';
			objPath = 'src/assets/models/' + modelName + '/' + modelName + '.obj';
		break;

		case "white":
			mtlPath = 'src/assets/models/pieceMtl/white' + colorScheme.whitePieceColor + '.mtl';
			objPath = 'src/assets/models/' + modelName + '/' + modelName + '.obj';
		break;

		case "black":
			mtlPath = 'src/assets/models/pieceMtl/black' + colorScheme.blackPieceColor + '.mtl';
			objPath = 'src/assets/models/' + modelName + '/' + modelName + '.obj';
		break;

		default:
			mtlPath = 'src/assets/models/' + modelName + '/' + modelName + '.mtl';
			objPath = 'src/assets/models/' + modelName + '/' + modelName + '.obj';
		break;
	}

	const objLoader = new OBJLoader();
	const mtlLoader = new MTLLoader();
	let model = null;
	mtlLoader.load(mtlPath, (mtl) => {
	mtl.preload();
	objLoader.setMaterials(mtl);
	objLoader.load(objPath, (root) => {
		model = root;
		model.scale.set(scale,scale,scale);
		model.rotation.x = rotation.x;
		model.rotation.y = rotation.y;
		model.rotation.z = rotation.z;
		model.position.x = position.x;
		model.position.y = position.y;
		model.position.z = position.z;
		model.children[0].name = name;
		scene.add(model);
	});
	});
}

function removeObject(obj){

	scene.remove(obj);

	if (obj.geometry) {
		obj.geometry.dispose();
	}

	if (obj.material) {
		if (Array.isArray(obj.material)) {
		  obj.material.forEach(material => material.dispose());
		} else {
		  obj.material.dispose();
		}
	}

}

function loadPieces(){

	loadModel('whiteRook', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(-3.5,0,3.5), "whiteRook1");
	loadModel('whiteKnight', 1, new THREE.Vector3(0,-Math.PI/2,0), new THREE.Vector3(-2.5,0,3.5), "whiteKnight1");
	loadModel('whiteBishop', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(-1.5,0,3.5), "whiteBishop1");
	loadModel('whiteQueen', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(-0.5,0,3.5), "whiteQueen");
	loadModel('whiteKing', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(0.5,0,3.5), "whiteKing");
	loadModel('whiteRook', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(3.5,0,3.5), "whiteRook2");
	loadModel('whiteKnight', 1, new THREE.Vector3(0,-Math.PI/2,0), new THREE.Vector3(2.5,0,3.5), "whiteKnight2");
	loadModel('whiteBishop', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(1.5,0,3.5), "whiteBishop2");

	for(let i = 0; i < 8; i++){
		loadModel('whitePawn', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(-3.5 + i,0,2.5), "whitePawn" + (i + 1).toString());
	}

	loadModel('blackRook', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(-3.5,0,-3.5), "blackRook1");
	loadModel('blackKnight', 1, new THREE.Vector3(0,Math.PI/2,0), new THREE.Vector3(-2.5,0,-3.5), "blackKnight1");
	loadModel('blackBishop', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(-1.5,0,-3.5), "blackBishop1");
	loadModel('blackQueen', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(-0.5,0,-3.5), "blackQueen");
	loadModel('blackKing', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(0.5,0,-3.5), "blackKing");
	loadModel('blackRook', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(3.5,0,-3.5), "blackRook2");
	loadModel('blackKnight', 1, new THREE.Vector3(0,Math.PI/2,0), new THREE.Vector3(2.5,0,-3.5), "blackKnight2");
	loadModel('blackBishop', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(1.5,0,-3.5), "blackBishop2");

	for(let i = 0; i < 8; i++){
		loadModel('blackPawn', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(-3.5 + i,0,-2.5), "blackPawn" + (i + 1).toString());
	}
}

function initializeGame(){
	turn = "white";
	selectedTile = null;
	pieces = new Map();
	board = new Map();
	enPassantTarget = null;
	promotionSelection = false;
	piecePendingPromotion = null;
    gameOver = false;
	loadPieces();
	loadModel('board', 1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), "board");


	pieces.set("whiteRook1", new Piece("a1", "rook", "white", 1));
	pieces.set("whiteKnight1", new Piece("b1", "knight", "white", 1));
	pieces.set("whiteBishop1", new Piece("c1", "bishop", "white", 1));
	pieces.set("whiteQueen", new Piece("d1", "queen", "white", 1));
	pieces.set("whiteKing", new Piece("e1", "king", "white", 1));
	pieces.set("whiteBishop2", new Piece("f1", "bishop", "white", 2));
	pieces.set("whiteKnight2", new Piece("g1", "knight", "white", 2));
	pieces.set("whiteRook2", new Piece("h1", "rook", "white", 2));

	pieces.set("whitePawn1", new Piece("a2", "pawn", "white", 1));
	pieces.set("whitePawn2", new Piece("b2", "pawn", "white", 2));
	pieces.set("whitePawn3", new Piece("c2", "pawn", "white", 3));
	pieces.set("whitePawn4", new Piece("d2", "pawn", "white", 4));
	pieces.set("whitePawn5", new Piece("e2", "pawn", "white", 5));
	pieces.set("whitePawn6", new Piece("f2", "pawn", "white", 6));
	pieces.set("whitePawn7", new Piece("g2", "pawn", "white", 7));
	pieces.set("whitePawn8", new Piece("h2", "pawn", "white", 8));


	pieces.set("blackRook1", new Piece("a8", "rook", "black", 1));
	pieces.set("blackKnight1", new Piece("b8", "knight", "black", 1));
	pieces.set("blackBishop1", new Piece("c8", "bishop", "black", 1));
	pieces.set("blackQueen", new Piece("d8", "queen", "black", 1));
	pieces.set("blackKing", new Piece("e8", "king", "black", 1));
	pieces.set("blackBishop2", new Piece("f8", "bishop", "black", 2));
	pieces.set("blackKnight2", new Piece("g8", "knight", "black", 2));
	pieces.set("blackRook2", new Piece("h8", "rook", "black", 2));

	pieces.set("blackPawn1", new Piece("a7", "pawn", "black", 1));
	pieces.set("blackPawn2", new Piece("b7", "pawn", "black", 2));
	pieces.set("blackPawn3", new Piece("c7", "pawn", "black", 3));
	pieces.set("blackPawn4", new Piece("d7", "pawn", "black", 4));
	pieces.set("blackPawn5", new Piece("e7", "pawn", "black", 5));
	pieces.set("blackPawn6", new Piece("f7", "pawn", "black", 6));
	pieces.set("blackPawn7", new Piece("g7", "pawn", "black", 7));
	pieces.set("blackPawn8", new Piece("h7", "pawn", "black", 8));

	board.set("a1", "whiteRook1");
	board.set("b1", "whiteKnight1");
	board.set("c1", "whiteBishop1");
	board.set("d1", "whiteQueen");
	board.set("e1", "whiteKing");
	board.set("f1", "whiteBishop2");
	board.set("g1", "whiteKnight2");
	board.set("h1", "whiteRook2");

	board.set("a2", "whitePawn1");
	board.set("b2", "whitePawn2");
	board.set("c2", "whitePawn3");
	board.set("d2", "whitePawn4");
	board.set("e2", "whitePawn5");
	board.set("f2", "whitePawn6");
	board.set("g2", "whitePawn7");
	board.set("h2", "whitePawn8");

	board.set("a8", "blackRook1");
	board.set("b8", "blackKnight1");
	board.set("c8", "blackBishop1");
	board.set("d8", "blackQueen");
	board.set("e8", "blackKing");
	board.set("f8", "blackBishop2");
	board.set("g8", "blackKnight2");
	board.set("h8", "blackRook2");

	board.set("a7", "blackPawn1");
	board.set("b7", "blackPawn2");
	board.set("c7", "blackPawn3");
	board.set("d7", "blackPawn4");
	board.set("e7", "blackPawn5");
	board.set("f7", "blackPawn6");
	board.set("g7", "blackPawn7");
	board.set("h7", "blackPawn8");

	refreshMoveList();

}

function addHighlight(tiles, color){
	let highlight = null;
	let highlightPos = null;
	for(let i = 0; i < tiles.length; i++){

		highlight = new THREE.Mesh(
			new THREE.TorusGeometry( 0.4, 0.035, 32), 
			new THREE.MeshStandardMaterial({
				color: color, 
				emissive: color,
				emissiveIntensity: 1
			})
		);

		bloom.selection.add(highlight);

		highlight.rotateX(3*Math.PI/2);

		highlightPos = convertTileNametoCoord(tiles[i]);

		highlight.position.set(highlightPos[0], 0.05, highlightPos[1]);
		highlight.name = "highlight";

		scene.add(highlight);

	}
}

function removeHighlight(){
	let light = null;
	light = scene.getObjectByName("highlight");
	while(light != undefined){
		removeObject(light);
		light = scene.getObjectByName("highlight");
	}
}

function convertTileNametoCoord(tileName){
	return ["abcdefgh".indexOf(tileName[0]) - 3.5, -parseInt(tileName[1]) + 4.5];
}

function getTileDisplacement(tile, dx, dy){ //calculates the tile name of the tile dx to the right and dy above the give tile
	const ref = "abcdefgh";
	let newX = ref[ref.indexOf(tile[0]) + dx];
	let newY = (parseInt(tile[1]) + dy).toString();

	if(newX != undefined && !(newY <= 0 || newY >= 9)){
		return newX + newY;
	}else{
		return undefined
	}
}

function selectTile(tile){
	removeHighlight();
	addHighlight([tile], colorScheme.highlightSelfColors[colorScheme.highlightSelf]); // highlights the piece itself
	addHighlight(pieces.get(board.get(tile)).moveList, colorScheme.highlightOtherColors[colorScheme.highlightOther]); // highlight all of its moves
	selectedTile = tile;
}

function deselectTile(){
	removeHighlight();
	selectedTile = null;
}

function refreshMoveList(){
    pieces.forEach(function(value){ value.moveList = value.getMoveList(board, true, enPassantTarget); });
}

function movePiece(piece, tile) {

    const specialMove = piece.moveList.specialMoves?.find(m => m.to == tile);

    if (specialMove?.type == "enPassant") {
        const capturedPawnId = board.get(specialMove.capturedPawnTile);
        if (capturedPawnId) {
            pieces.delete(capturedPawnId);
            removeObject(scene.getObjectByName(capturedPawnId).parent);
            board.set(specialMove.capturedPawnTile, undefined);
            playSound('capture');
        }
    } else {
        let capturedPiece = board.get(tile);
        if (capturedPiece != undefined) {
            pieces.delete(capturedPiece);
            removeObject(scene.getObjectByName(capturedPiece).parent);
            playSound('capture'); // normal capture
        }else{
            playSound('move'); // normal move, no capture
        }
    }

    const pieceObject = scene.getObjectByName(board.get(selectedTile));
    const pieceRoot = pieceObject.parent; // animate the parent, not the child mesh

    const targetCoords = convertTileNametoCoord(tile);
    const targetPos = new THREE.Vector3(targetCoords[0], 0, targetCoords[1]);
    const startPos = pieceRoot.position.clone(); // start from parent's position

    activeAnimations.push({
        object: pieceRoot,
        startPos: startPos.clone(),
        endPos: targetPos.clone(),
        elapsed: 0,
        onComplete: () => {

            if (specialMove?.type == "castling") {
                // Look up rook directly from pieces map
                const rookId = specialMove.rookFrom == `h${piece.color == "white" ? "1" : "8"}`
                    ? piece.color + "Rook2"
                    : piece.color + "Rook1";
                
                const rook = pieces.get(rookId);
                const rookObject = scene.getObjectByName(rookId);
        
                if (rook && rookObject) {
                    const rookRoot = rookObject.parent;
                    const rookTargetCoords = convertTileNametoCoord(specialMove.rookTo);
                    const rookTargetPos = new THREE.Vector3(rookTargetCoords[0], 0, rookTargetCoords[1]);
        
                    activeAnimations.push({
                        object: rookRoot,
                        startPos: rookRoot.position.clone(),
                        endPos: rookTargetPos,
                        elapsed: 0,
                        onComplete: () => {
                            board.set(specialMove.rookFrom, undefined);
                            board.set(specialMove.rookTo, rookId);
                            rook.tile = specialMove.rookTo;
                            rook.hasMoved = true;
                        }
                    });
                }
            }
        
            board.set(piece.tile, undefined);
            board.set(tile, pieceObject.name);
            piece.tile = tile;
            piece.hasMoved = true;
        
            if (specialMove?.type == "promotion") {
                promptPromotion(piece);
            }
        
            refreshMoveList();

            // Check detection - is the enemy king under attack?
            const enemyColor = piece.color == "white" ? "black" : "white";
            const enemyKing = pieces.get(enemyColor + "King");
            let enemyKingInCheck = false;

            pieces.forEach(value => {
                if (value.color == piece.color) {
                    if (value.moveList.includes(enemyKing.tile)) {
                        enemyKingInCheck = true;
                    }
                }
            });
        
            let blackMoveList = [];
            let whiteMoveList = [];
            pieces.forEach(value => { if (value.color == "black") blackMoveList = blackMoveList.concat(value.moveList); });
            pieces.forEach(value => { if (value.color == "white") whiteMoveList = whiteMoveList.concat(value.moveList); });

            if (whiteMoveList.length == 0) {
                gameOver = true;
                playSound('gameover');
                showGameOver("black");
            } else if (blackMoveList.length == 0) {
                gameOver = true;
                playSound('gameover');
                showGameOver("white");
            } else if (enemyKingInCheck) {
                playSound('check');
            }

            // Trigger bot move if it's now the bot's turn
            if (!gameOver && botEnabled && turn == "black") {
                setTimeout(doBotMove, 300); // small delay so the animation finishes visually
            }

        }
    });

    enPassantTarget = null;
    if (piece.type == "pawn" && Math.abs(parseInt(piece.tile[1]) - parseInt(tile[1])) == 2) {
        enPassantTarget = piece.color == "white"
            ? piece.tile[0] + (parseInt(piece.tile[1]) + 1).toString()
            : piece.tile[0] + (parseInt(piece.tile[1]) - 1).toString();
    }

    deselectTile();
    turn = turn == "white" ? "black" : "white";
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function promptPromotion(piece){

	promotionSelection = true;
	piecePendingPromotion = piece;

	const labelCenterCoords = convertTileNametoCoord(piece.tile);
	const x = labelCenterCoords[0];
	const z = labelCenterCoords[1];

	createLabel("Knight", new THREE.Vector3(x, 1.0, z), "label_choiceKnight");
	createLabel("Bishop", new THREE.Vector3(x, 1.3, z), "label_choiceBishop");
	createLabel("Rook", new THREE.Vector3(x, 1.6, z), "label_choiceRook");
	createLabel("Queen", new THREE.Vector3(x, 1.9, z), "label_choiceQueen");

}

function submitPromotion(piece, choice){

	let newPieceName = null
	let newFileName = null;
	let pieceRotation = null;

	switch(choice){

		case "rook":
			newPieceName = piece.color + "Rook" + (piece.id + 2).toString();
			newFileName = piece.color + "Rook";
			pieceRotation = new THREE.Vector3(0,0,0);
		break;

		case "knight":
			newPieceName = piece.color + "Knight" + (piece.id + 2).toString();
			newFileName = piece.color + "Knight";
			pieceRotation = piece.color == "white" ? new THREE.Vector3(0,-Math.PI/2,0) : new THREE.Vector3(0,Math.PI/2,0);
		break;

		case "bishop":
			newPieceName = piece.color + "Bishop" + (piece.id + 2).toString();
			newFileName = piece.color + "Bishop";
			pieceRotation = new THREE.Vector3(0,0,0);
		break;

		case "queen":
			newPieceName = piece.color + "Queen" + (piece.id + 2).toString();
			newFileName = piece.color + "Queen";
			pieceRotation = new THREE.Vector3(0,0,0);
		break;

	}

	pieces.delete(board.get(piece.tile));
	removeObject(scene.getObjectByName(board.get(piece.tile)).parent);
	board.set(piece.tile, newPieceName);
	piece.type = choice;
	pieces.set(newPieceName, piece);

	const tileCoords = convertTileNametoCoord(piece.tile);
	loadModel(newFileName, 1, pieceRotation, new THREE.Vector3(tileCoords[0],0,tileCoords[1]), newPieceName);
	
	removeLabel("label_choiceRook");
	removeLabel("label_choiceBishop");
	removeLabel("label_choiceQueen");
	removeLabel("label_choiceKnight");

}

function createLabel(text, position, name) {
    // Draw text onto a canvas
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.roundRect(4, 4, canvas.width - 8, canvas.height - 8, 8);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,   // prevents z-fighting with pieces
        side: THREE.DoubleSide
    });

    const geometry = new THREE.PlaneGeometry(1, 0.25); // width, height in world units
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(position.x, position.y, position.z);
    mesh.name = name;

    scene.add(mesh);
    return mesh;
}

function removeLabel(name) {
    const mesh = scene.getObjectByName(name);
    if (!mesh) return;
    mesh.material.map.dispose();
    mesh.material.dispose();
    mesh.geometry.dispose();
    scene.remove(mesh);
}

function onMouseDown(event){

    if (activeAnimations.length > 0) return; // block input during animations
    if (botEnabled && turn == "black") return; // block during bot's turn

	const coords = new THREE.Vector2(
		(event.clientX / renderer.domElement.clientWidth) * 2 - 1,
		-((event.clientY / renderer.domElement.clientHeight) * 2 - 1));

	raycaster.setFromCamera(coords, camera);
	const intersections = raycaster.intersectObjects(scene.children, true);

	let clickedTile = null;

	if(intersections.length > 0){ // ignore intersections with the highlight rings
		while(intersections[0].object.name == "highlight"){
			intersections.shift();
			if(intersections.length == 0){
				break;
			}
		}
	}

	if(intersections.length > 0){ // something was clicked

		const selectedObject = intersections[0].object;

		if(promotionSelection){ // the user needs to select a pawn promotion before they can continue

			if (selectedObject.name?.startsWith("label_")){
	
				let choice = selectedObject.name;
				choice = choice.slice(12, choice.length)

				switch(choice){

					case "Rook":
						choice = "rook"
					break;
			
					case "Knight":
						choice = "knight"
					break;
			
					case "Bishop":
						choice = "bishop"
					break;
			
					case "Queen":
						choice = "queen"
					break;
			
				}

				submitPromotion(piecePendingPromotion, choice);
				promotionSelection = false;
				piecePendingPromotion = null;
	
			}

			return;
	
		}

		if(selectedObject.name == "board"){ // board was clicked

			const boardUV = raycaster.intersectObject(scene.getObjectByName("board"))[0].uv;
			const boardUVTile = "abcdefgh"[Math.floor(boardUV.x * 8)] + Math.floor(boardUV.y * 8 + 1).toString();
			clickedTile = boardUVTile;

		}else{ // a piece was clicked

			clickedTile = pieces.get(selectedObject.name).tile;

		}

	}

	if(clickedTile != null){ // a tile was clicked

		let selectedPiece = board.get(clickedTile);

		if(selectedTile == null){ // no tiles currently selected

			if(selectedPiece != undefined && selectedPiece[0] == turn[0]){ // the selected tile has a piece

				selectTile(clickedTile);

			}

		}else{ // a tile was already selected

			let prevSelectedPiece = pieces.get(board.get(selectedTile));

			if(prevSelectedPiece.moveList.includes(clickedTile)){ // player clicked a valid move

				movePiece(prevSelectedPiece, clickedTile);
				
			}else{ // player clicked the same piece or a non-valid tile

				deselectTile();

			}

		}

	}

}

function addLighting(){

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionLight1.position.set(-5, 1,- 5);
    directionLight1.target.position.set(0, 0, 0);
    scene.add(directionLight1);
    scene.add(directionLight1.target);

    const directionLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionLight2.position.set(5, 1, -5);
    directionLight2.target.position.set(0, 0, 0);
    scene.add(directionLight2);
    scene.add(directionLight2.target);

    const directionLight3 = new THREE.DirectionalLight(0xffffff, 1);
    directionLight3.position.set(-5, 1, 5);
    directionLight3.target.position.set(0, 0, 0);
    scene.add(directionLight3);
    scene.add(directionLight3.target);

    const directionLight4 = new THREE.DirectionalLight(0xffffff, 1);
    directionLight4.position.set(5, 1, 5);
    directionLight4.target.position.set(0, 0, 0);
    scene.add(directionLight4);
    scene.add(directionLight4.target);

}

function restartGame(){

    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }

    addLighting();

    initializeGame();

}


class Piece {
    constructor(tile, type, color, id) {
        this.tile = tile;
        this.type = type;
        this.color = color;
        this.id = id;
        this.moveList = [];
        this.hasMoved = false; // needed for castling and pawn double-push tracking
    }

    getMoveList(board, doLegalMoveCheck, enPassantTarget = null, piecesMap = null) {
        // enPassantTarget: the tile a pawn can capture via en passant (e.g. "e6"), or null

        // Use provided piecesMap (for bot simulation) or fall back to global pieces
        const pieceRegistry = piecesMap ?? pieces;

        let result = [];
        let specialMoves = []; // { type, from, to, extra } — for castling, en passant, promotion

		// Helper: slide in a direction until blocked or out of bounds
        const slide = (rowStep, colStep) => {
            let tiles = [];
            let current = this.tile;
            while (true) {
                let next = getTileDisplacement(current, rowStep, colStep);
                if (next == undefined) break;
                tiles.push(next);
                if (board.get(next) != undefined) break;
                current = next;
            }
            return tiles;
        };

        if (this.type == "rook") {
            result.push(...slide(1, 0));
            result.push(...slide(-1, 0));
            result.push(...slide(0, 1));
            result.push(...slide(0, -1));
        }

        if (this.type == "knight") {
            result.push(getTileDisplacement(this.tile, -2, 1));
            result.push(getTileDisplacement(this.tile, -2, -1));
            result.push(getTileDisplacement(this.tile, 2, 1));
            result.push(getTileDisplacement(this.tile, 2, -1));
            result.push(getTileDisplacement(this.tile, -1, 2));
            result.push(getTileDisplacement(this.tile, -1, -2));
            result.push(getTileDisplacement(this.tile, 1, 2));
            result.push(getTileDisplacement(this.tile, 1, -2));
        }

        if (this.type == "bishop") {
            result.push(...slide(1, 1));
            result.push(...slide(1, -1));
            result.push(...slide(-1, 1));
            result.push(...slide(-1, -1));
        }

        if (this.type == "queen") {
            result.push(...slide(1, 0));
            result.push(...slide(-1, 0));
            result.push(...slide(0, 1));
            result.push(...slide(0, -1));
            result.push(...slide(1, 1));
            result.push(...slide(1, -1));
            result.push(...slide(-1, 1));
            result.push(...slide(-1, -1));
        }

        if (this.type == "king") {
            result.push(getTileDisplacement(this.tile, -1, -1));
            result.push(getTileDisplacement(this.tile, -1, 0));
            result.push(getTileDisplacement(this.tile, -1, 1));
            result.push(getTileDisplacement(this.tile, 0, -1));
            result.push(getTileDisplacement(this.tile, 0, 1));
            result.push(getTileDisplacement(this.tile, 1, -1));
            result.push(getTileDisplacement(this.tile, 1, 0));
            result.push(getTileDisplacement(this.tile, 1, 1));

            // Castling
            if (!this.hasMoved) {
                const backRank = this.color == "white" ? "1" : "8";

                // Helper: are all squares between king and rook empty?
                const pathClear = (tiles) => tiles.every(t => board.get(t) == undefined);

                // Helper: is the king currently in check or would pass through check?
                const notUnderAttack = (tiles) => {
                    if (!doLegalMoveCheck) return true;
                    const enemyColor = this.color == "white" ? "black" : "white";
                    for (const tile of tiles) {
                        for (const [, pieceId] of board.entries()) {
                            if (pieceId == undefined) continue;
                            if (pieceId[0] != enemyColor[0]) continue;
                            const enemyPiece = pieceRegistry.get(pieceId);
                            if (enemyPiece.getMoveList(board, false).includes(tile)) return false;
                        }
                    }
                    return true;
                };

                // Kingside castling
                const kingsideRookId = this.color + "Rook2";
                const kingsideRook = pieceRegistry.get(kingsideRookId);
                if (
                    kingsideRook && !kingsideRook.hasMoved &&
                    pathClear([`f${backRank}`, `g${backRank}`]) &&
                    notUnderAttack([this.tile, `f${backRank}`, `g${backRank}`])
                ) {
                    specialMoves.push({
                        type: "castling",
                        to: `g${backRank}`,
                        rookFrom: `h${backRank}`,
                        rookTo: `f${backRank}`
                    });
                    result.push(`g${backRank}`);
                }

                // Queenside castling
                const queensideRookId = this.color + "Rook1";
                const queensideRook = pieceRegistry.get(queensideRookId);
                if (
                    queensideRook && !queensideRook.hasMoved &&
                    pathClear([`b${backRank}`, `c${backRank}`, `d${backRank}`]) &&
                    notUnderAttack([this.tile, `d${backRank}`, `c${backRank}`])
                ) {
                    specialMoves.push({
                        type: "castling",
                        to: `c${backRank}`,
                        rookFrom: `a${backRank}`,
                        rookTo: `d${backRank}`
                    });
                    result.push(`c${backRank}`);
                }
            }
        }

        if (this.type == "pawn") {
            if (this.color == "white") {
                let oneStep = getTileDisplacement(this.tile, 0, 1);
                if (oneStep && board.get(oneStep) == undefined) {
                    result.push(oneStep);
                    if (this.tile[1] == '2') {
                        let twoStep = getTileDisplacement(this.tile, 0, 2);
                        if (twoStep && board.get(twoStep) == undefined) {
                            result.push(twoStep);
                        }
                    }
                }
                let captureLeft  = getTileDisplacement(this.tile, -1, 1);
                let captureRight = getTileDisplacement(this.tile,  1, 1);
                if (captureLeft  && board.get(captureLeft)?.[0]  == 'b') result.push(captureLeft);
                if (captureRight && board.get(captureRight)?.[0] == 'b') result.push(captureRight);

                // En passant
                if (enPassantTarget) {
                    if (captureLeft  == enPassantTarget) {
                        specialMoves.push({ type: "enPassant", to: captureLeft,  capturedPawnTile: getTileDisplacement(captureLeft,  0, -1) });
                        result.push(captureLeft);
                    }
                    if (captureRight == enPassantTarget) {
                        specialMoves.push({ type: "enPassant", to: captureRight, capturedPawnTile: getTileDisplacement(captureRight, 0, -1) });
                        result.push(captureRight);
                    }
                }

                // Pawn promotion (rank 7 -> rank 8)
                if (oneStep && oneStep[1] == '8') {
                    specialMoves.push({ type: "promotion", to: oneStep });
                }
                if (captureLeft  && captureLeft[1]  == '8' && board.get(captureLeft)?.[0]  == 'b') {
                    specialMoves.push({ type: "promotion", to: captureLeft });
                }
                if (captureRight && captureRight[1] == '8' && board.get(captureRight)?.[0] == 'b') {
                    specialMoves.push({ type: "promotion", to: captureRight });
                }
            }

            if (this.color == "black") {
                let oneStep = getTileDisplacement(this.tile, 0, -1);
                if (oneStep && board.get(oneStep) == undefined) {
                    result.push(oneStep);
                    if (this.tile[1] == '7') {
                        let twoStep = getTileDisplacement(this.tile, 0, -2);
                        if (twoStep && board.get(twoStep) == undefined) {
                            result.push(twoStep);
                        }
                    }
                }
                let captureLeft  = getTileDisplacement(this.tile, -1, -1);
                let captureRight = getTileDisplacement(this.tile,  1, -1);
                if (captureLeft  && board.get(captureLeft)?.[0]  == 'w') result.push(captureLeft);
                if (captureRight && board.get(captureRight)?.[0] == 'w') result.push(captureRight);

                // En passant
                if (enPassantTarget) {
                    if (captureLeft  == enPassantTarget) {
                        specialMoves.push({ type: "enPassant", to: captureLeft,  capturedPawnTile: getTileDisplacement(captureLeft,  0, 1) });
                        result.push(captureLeft);
                    }
                    if (captureRight == enPassantTarget) {
                        specialMoves.push({ type: "enPassant", to: captureRight, capturedPawnTile: getTileDisplacement(captureRight, 0, 1) });
                        result.push(captureRight);
                    }
                }

                // Pawn promotion (rank 2 -> rank 1)
                if (oneStep && oneStep[1] == '1') {
                    specialMoves.push({ type: "promotion", to: oneStep });
                }
                if (captureLeft  && captureLeft[1]  == '1' && board.get(captureLeft)?.[0]  == 'w') {
                    specialMoves.push({ type: "promotion", to: captureLeft });
                }
                if (captureRight && captureRight[1] == '1' && board.get(captureRight)?.[0] == 'w') {
                    specialMoves.push({ type: "promotion", to: captureRight });
                }
            }
        }

        result = result.filter((value) => value != undefined);
        result = result.filter((value) => (board.get(value) ?? 'a')[0] != this.color[0]);

        // Legal move check
        function legalMoveCheck(tile, color, type, id, value) {
            let possibleBoard = new Map(board);

            // Handle en passant capture on the simulated board
            const epMove = specialMoves.find(m => m.type == "enPassant" && m.to == value);
            if (epMove) {
                possibleBoard.set(epMove.capturedPawnTile, undefined);
            }

            possibleBoard.set(tile, undefined);
            possibleBoard.set(value, color + type[0].toUpperCase() + type.slice(1) + id.toString());

            // If castling, also move the rook in the simulated board
            const castleMove = specialMoves.find(m => m.type == "castling" && m.to == value);
            if (castleMove) {
                const rookId = possibleBoard.get(castleMove.rookFrom);
                if (rookId) {
                    possibleBoard.set(castleMove.rookFrom, undefined);
                    possibleBoard.set(castleMove.rookTo, rookId);
                }
            }

            let friendlyKingTile = type == "king" ? value : pieceRegistry.get(color + "King").tile;

            // If king not found in registry (simulation edge case), try finding it on the board
            if (!friendlyKingTile) {
                for (const [t, id] of possibleBoard.entries()) {
                    if (id && id === color + "King") {
                        friendlyKingTile = t;
                        break;
                    }
                }
            }

            if (!friendlyKingTile) return true; // can't find king, assume safe

            let enemyColor = color == "white" ? "black" : "white";

            for (const [, pieceId] of possibleBoard.entries()) {
                if (pieceId == undefined) continue;
                if (pieceId[0] != enemyColor[0]) continue;
                const enemyPiece = pieceRegistry.get(pieceId);
                if (!enemyPiece) continue;
                if (enemyPiece.getMoveList(possibleBoard, false, null, pieceRegistry).includes(friendlyKingTile)) {
                    return false;
                }
            }

            return true;
        }

        if (doLegalMoveCheck) {
            result = result.filter(legalMoveCheck.bind(null, this.tile, this.color, this.type, this.id));
        }

        // Attach special move metadata to the result for the caller to use
        result.specialMoves = specialMoves.filter(m => result.includes(m.to));

        return result;
    }
}


/*
	Initialze Renderer
*/

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(7);
camera.position.setY(7);

renderer.render(scene, camera);

const controls = new OrbitControls( camera, renderer.domElement );

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloom = new SelectiveBloomEffect(scene, camera, {
    intensity: 1,
    luminanceThreshold: 0.1,
});



composer.addPass(new EffectPass(camera, bloom));


/*
	Lighting
*/

addLighting();



/*
	Skybox
*/

const loader = new THREE.CubeTextureLoader();
const texture = loader.load( [
	'src/assets/skybox/px.png',
	'src/assets/skybox/nx.png',
	'src/assets/skybox/py.png',
	'src/assets/skybox/ny.png',
	'src/assets/skybox/pz.png',
	'src/assets/skybox/nz.png'
] );
scene.background = texture;





/*
	Initialze Game Variables
*/

let pieces, board, selectedTile, turn, enPassantTarget, promotionSelection, piecePendingPromotion, gameOver = null;

let colorScheme = {
	boardColor: 0,
	whitePieceColor: 0,
	blackPieceColor: 0,
	highlightSelf: 3,
	highlightOther: 1,
	highlightSelfColors: [
		0xffffff, // white
        0xff0000, // red
		0x00ff00, // green
        0x0000ff // blue
	],
	highlightOtherColors: [
		0xffffff, // white
        0xff0000, // red
		0x00ff00, // green
        0x0000ff // blue
	]
};

let activeAnimations = []; // list of in-progress move animations
const ANIMATION_DURATION = 0.3; // seconds

let botEnabled = true;

initializeGame();




/*
	Settings Menu
*/

const menuBtn      = document.getElementById('menu-btn');
const menuOverlay  = document.getElementById('menu-overlay');
const menuClose    = document.getElementById('menu-close');
const menuCancel   = document.getElementById('menu-cancel');
const menuApply    = document.getElementById('menu-apply');

function openMenu() {

    // Sync dropdowns to current colorScheme values
    document.getElementById('setting-bot').value = botEnabled ? 1 : 0;
    document.getElementById('setting-board').value          = colorScheme.boardColor;
    document.getElementById('setting-white').value          = colorScheme.whitePieceColor;
    document.getElementById('setting-black').value          = colorScheme.blackPieceColor;
    document.getElementById('setting-highlight-self').value  = colorScheme.highlightSelf;
    document.getElementById('setting-highlight-other').value = colorScheme.highlightOther;
    menuOverlay.style.display = 'flex';

}

function closeMenu() {

    menuOverlay.style.display = 'none';

}

function applySettings() {

    botEnabled = parseInt(document.getElementById('setting-bot').value) == 1;

    colorScheme.boardColor       = parseInt(document.getElementById('setting-board').value);
    colorScheme.whitePieceColor  = parseInt(document.getElementById('setting-white').value);
    colorScheme.blackPieceColor  = parseInt(document.getElementById('setting-black').value);
    colorScheme.highlightSelf    = parseInt(document.getElementById('setting-highlight-self').value);
    colorScheme.highlightOther   = parseInt(document.getElementById('setting-highlight-other').value);

    closeMenu();

    // Remove all existing piece and board models from the scene
    scene.children
        .filter(obj => obj.children?.[0]?.name && obj.children[0].name !== 'board')
        .forEach(obj => removeObject(obj));
    const boardObj = scene.getObjectByName('board');
    if (boardObj) removeObject(boardObj.parent ?? boardObj);

    // Re-initialize with new color scheme
    initializeGame();

}

menuBtn.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
menuCancel.addEventListener('click', closeMenu);
menuApply.addEventListener('click', applySettings);

// Close on backdrop click
menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) closeMenu();
});

// Prevent clicks inside the panel from closing it
menuOverlay.querySelector('div').addEventListener('click', (e) => e.stopPropagation());



/*
	Settings Menu
*/


const gameoverOverlay  = document.getElementById('gameover-overlay');
const gameoverTitle    = document.getElementById('gameover-title');
const gameoverSubtitle = document.getElementById('gameover-subtitle');
const gameoverIcon     = document.getElementById('gameover-icon');

function showGameOver(winner) {

    gameoverIcon.textContent     = winner == "white" ? "♔" : "♚";
    gameoverTitle.textContent    = "Checkmate!";
    gameoverSubtitle.textContent = winner == "white" ? "White wins" : "Black wins";
    gameoverOverlay.style.display = 'flex';

}

function closeGameOver() {

    gameoverOverlay.style.display = 'none';

}

document.getElementById('gameover-restart').addEventListener('click', () => {
    closeGameOver();
    restartGame();
});

document.getElementById('gameover-settings').addEventListener('click', () => {
    closeGameOver();
    openMenu(); // reuses existing settings menu
});


/*
    Audio
*/

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {

    // AudioContext requires a user gesture to start — resume if suspended
    if (audioCtx.state === 'suspended') audioCtx.resume();

    switch(type) {

        case 'move': {
            // Short soft click
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.1);
            break;
        }

        case 'capture': {
            // Slightly heavier thud
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.15);
            break;
        }

        case 'check': {
            // Two-tone alert
            [0, 0.12].forEach((delay, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(i == 0 ? 523 : 659, audioCtx.currentTime + delay);
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + 0.1);
                osc.start(audioCtx.currentTime + delay);
                osc.stop(audioCtx.currentTime + delay + 0.1);
            });
            break;
        }

        case 'gameover': {
            // Descending three-note sequence
            [0, 0.18, 0.38].forEach((delay, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime([523, 415, 311][i], audioCtx.currentTime + delay);
                gain.gain.setValueAtTime(0.3, audioCtx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + 0.25);
                osc.start(audioCtx.currentTime + delay);
                osc.stop(audioCtx.currentTime + delay + 0.25);
            });
            break;
        }

    }
}


/*
    Bot
*/

const BOT_DEPTH = 3; // how many moves ahead the bot looks (higher = stronger but slower)

const PIECE_VALUES = {
    pawn:   100,
    knight: 320,
    bishop: 330,
    rook:   500,
    queen:  900,
    king:   20000
};

// Piece-square tables — bonus points for good piece placement
const PST = {
    pawn: [
         0,  0,  0,  0,  0,  0,  0,  0,
        50, 50, 50, 50, 50, 50, 50, 50,
        10, 10, 20, 30, 30, 20, 10, 10,
         5,  5, 10, 25, 25, 10,  5,  5,
         0,  0,  0, 20, 20,  0,  0,  0,
         5, -5,-10,  0,  0,-10, -5,  5,
         5, 10, 10,-20,-20, 10, 10,  5,
         0,  0,  0,  0,  0,  0,  0,  0
    ],
    knight: [
        -50,-40,-30,-30,-30,-30,-40,-50,
        -40,-20,  0,  0,  0,  0,-20,-40,
        -30,  0, 10, 15, 15, 10,  0,-30,
        -30,  5, 15, 20, 20, 15,  5,-30,
        -30,  0, 15, 20, 20, 15,  0,-30,
        -30,  5, 10, 15, 15, 10,  5,-30,
        -40,-20,  0,  5,  5,  0,-20,-40,
        -50,-40,-30,-30,-30,-30,-40,-50
    ],
    bishop: [
        -20,-10,-10,-10,-10,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5, 10, 10,  5,  0,-10,
        -10,  5,  5, 10, 10,  5,  5,-10,
        -10,  0, 10, 10, 10, 10,  0,-10,
        -10, 10, 10, 10, 10, 10, 10,-10,
        -10,  5,  0,  0,  0,  0,  5,-10,
        -20,-10,-10,-10,-10,-10,-10,-20
    ],
    rook: [
         0,  0,  0,  0,  0,  0,  0,  0,
         5, 10, 10, 10, 10, 10, 10,  5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
         0,  0,  0,  5,  5,  0,  0,  0
    ],
    queen: [
        -20,-10,-10, -5, -5,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5,  5,  5,  5,  0,-10,
         -5,  0,  5,  5,  5,  5,  0, -5,
          0,  0,  5,  5,  5,  5,  0, -5,
        -10,  5,  5,  5,  5,  5,  0,-10,
        -10,  0,  5,  0,  0,  0,  0,-10,
        -20,-10,-10, -5, -5,-10,-10,-20
    ],
    king: [
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -20,-30,-30,-40,-40,-30,-30,-20,
        -10,-20,-20,-20,-20,-20,-20,-10,
         20, 20,  0,  0,  0,  0, 20, 20,
         20, 30, 10,  0,  0, 10, 30, 20
    ]
};

function getPSTScore(type, tile, color) {
    const col = "abcdefgh".indexOf(tile[0]);
    const row = parseInt(tile[1]) - 1;
    // White reads the table bottom-up, black top-down
    const index = color == "white"
        ? (7 - row) * 8 + col
        : row * 8 + col;
    return PST[type]?.[index] ?? 0;
}

function evaluateBoard(piecesMap) {
    let score = 0;
    piecesMap.forEach(piece => {
        const value = PIECE_VALUES[piece.type] + getPSTScore(piece.type, piece.tile, piece.color);
        score += piece.color == "white" ? value : -value;
    });
    return score;
}

// Apply a move to a board/pieces map without touching the scene
function applyMoveToState(boardMap, piecesMap, pieceId, targetTile, specialMove) {
    const newBoard = new Map(boardMap);
    const newPieces = new Map(piecesMap);

    const piece = newPieces.get(pieceId);
    if (!piece) return null;

    const newPiece = Object.assign(Object.create(Object.getPrototypeOf(piece)), piece);
    newPiece.moveList = [];

    // Handle captures
    if (specialMove?.type == "enPassant") {
        newBoard.set(specialMove.capturedPawnTile, undefined);
        // Find and remove the captured pawn from pieces
        for (const [id, p] of newPieces) {
            if (p.tile == specialMove.capturedPawnTile) {
                newPieces.delete(id);
                break;
            }
        }
    } else {
        const captured = newBoard.get(targetTile);
        if (captured) newPieces.delete(captured);
    }

    // Move piece
    newBoard.set(piece.tile, undefined);
    newBoard.set(targetTile, pieceId);
    newPiece.tile = targetTile;
    newPiece.hasMoved = true;
    newPieces.set(pieceId, newPiece);

    // Handle castling rook
    if (specialMove?.type == "castling") {
        const rookId = newBoard.get(specialMove.rookFrom);
        if (rookId) {
            const rook = newPieces.get(rookId);
            if (rook) {
                const newRook = Object.assign(Object.create(Object.getPrototypeOf(rook)), rook);
                newRook.tile = specialMove.rookTo;
                newRook.hasMoved = true;
                newPieces.set(rookId, newRook);
                newBoard.set(specialMove.rookFrom, undefined);
                newBoard.set(specialMove.rookTo, rookId);
            }
        }
    }

    // Promotion — always promote to queen for bot
    if (specialMove?.type == "promotion") {
        const queenId = piece.color + "Queen" + Math.random().toString(36).slice(2);
        const newQueen = Object.assign(Object.create(Object.getPrototypeOf(newPiece)), newPiece);
        newQueen.type = "queen";
        newPieces.delete(pieceId);
        newPieces.set(queenId, newQueen);
        newBoard.set(targetTile, queenId);
    }

    return { board: newBoard, pieces: newPieces };
}

function getAllMovesForColor(color, boardMap, piecesMap, epTarget) {
    const moves = [];
    piecesMap.forEach((piece, pieceId) => {
        if (piece.color !== color) return;
        const moveList = piece.getMoveList(boardMap, true, epTarget, piecesMap); // <-- pass piecesMap
        moveList.forEach(targetTile => {
            const specialMove = moveList.specialMoves?.find(m => m.to == targetTile) ?? null;
            moves.push({ pieceId, targetTile, specialMove });
        });
    });
    return moves;
}

function minimax(boardMap, piecesMap, depth, alpha, beta, isMaximizing, epTarget) {

    if (depth == 0) {
        return { score: evaluateBoard(piecesMap) };
    }

    const color = isMaximizing ? "white" : "black";
    const moves = getAllMovesForColor(color, boardMap, piecesMap, epTarget);

    if (moves.length == 0) {
        // No moves = checkmate (losing) or stalemate (draw)
        return { score: isMaximizing ? -99999 : 99999 };
    }

    let bestMove = null;

    if (isMaximizing) {
        let maxScore = -Infinity;
        for (const move of moves) {
            const state = applyMoveToState(boardMap, piecesMap, move.pieceId, move.targetTile, move.specialMove);
            if (!state) continue;
            const result = minimax(state.board, state.pieces, depth - 1, alpha, beta, false, null);
            if (result.score > maxScore) {
                maxScore = result.score;
                bestMove = move;
            }
            alpha = Math.max(alpha, maxScore);
            if (beta <= alpha) break; // prune
        }
        return { score: maxScore, move: bestMove };
    } else {
        let minScore = Infinity;
        for (const move of moves) {
            const state = applyMoveToState(boardMap, piecesMap, move.pieceId, move.targetTile, move.specialMove);
            if (!state) continue;
            const result = minimax(state.board, state.pieces, depth - 1, alpha, beta, true, null);
            if (result.score < minScore) {
                minScore = result.score;
                bestMove = move;
            }
            beta = Math.min(beta, minScore);
            if (beta <= alpha) break; // prune
        }
        return { score: minScore, move: bestMove };
    }
}

function doBotMove() {
    if (gameOver || promotionSelection) return;

    const botColor = "black"; // bot always plays black
    const isMaximizing = botColor == "white";

    const result = minimax(board, pieces, BOT_DEPTH, -Infinity, Infinity, isMaximizing, enPassantTarget);

    if (!result.move) return; // no moves = game over, already handled

    const { pieceId, targetTile } = result.move;
    const piece = pieces.get(pieceId);

    // Refresh move list for this piece so specialMoves is populated
    piece.moveList = piece.getMoveList(board, true, enPassantTarget);

    // Temporarily set selectedTile so movePiece can find the piece object
    selectedTile = piece.tile;
    movePiece(piece, targetTile);
}



/*
	Initialze Controls
*/

const raycaster = new THREE.Raycaster();

document.addEventListener('mousedown', onMouseDown);


/*
	GAME LOOP
*/

let lastTime = performance.now();

function animate() {

    requestAnimationFrame(animate);
    controls.update();

    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    // Use a copy so any animations pushed during onComplete are safe
    const currentAnimations = [...activeAnimations];
    activeAnimations = [];

    currentAnimations.forEach(anim => {
        anim.elapsed += delta;
        const t = Math.min(anim.elapsed / ANIMATION_DURATION, 1);
        const ease = easeOutCubic(t);

        anim.object.position.x = anim.startPos.x + (anim.endPos.x - anim.startPos.x) * ease;
        anim.object.position.z = anim.startPos.z + (anim.endPos.z - anim.startPos.z) * ease;
        anim.object.position.y = Math.sin(Math.PI * t) * 1.5;

        if (t >= 1) {
            anim.object.position.copy(anim.endPos);
            if (anim.onComplete) anim.onComplete(); // may push to activeAnimations
        } else {
            activeAnimations.push(anim); // keep going
        }
    });

    scene.children.forEach(obj => {
        if (obj.name?.startsWith("label_")) obj.lookAt(camera.position);
    });

    composer.render();

}

animate();