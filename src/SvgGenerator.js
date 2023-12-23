import * as d3 from 'd3';
import React, { useState } from 'react';

const SvgGenerator = () => {
  const [R1, setR1] = useState(800);
  const [R2, setR2] = useState(600);
  const [D1, setD1] = useState(24);
  const [O1, setO1] = useState(17);
  const [O2, setO2] = useState(-17);
  const [SVG, setSVG] = useState(null);
  

  const CENTER_X = R1 / 2;
  const CENTER_Y = R1 / 2;

  
  const generateSVG = () => {
    // Supprimer l'ancien SVG s'il existe
    d3.select("svg").remove();
    
    // Créer un nouvel élément SVG
    const svg = d3.select("#svg-container").append("svg").attr("width", R1).attr("height", R1);
    
    // Ajouter les cercles
    // svg.append("circle").attr("cx", CENTER_X).attr("cy", CENTER_Y).attr("r", R1 / 2).attr("stroke", "black").attr("stroke-width", 2).attr("fill", "none");
    // svg.append("circle").attr("cx", CENTER_X).attr("cy", CENTER_Y).attr("r", R2 / 2).attr("stroke", "black").attr("stroke-width", 2).attr("fill", "none");

    
    const points = [];
 
    // Diviser les cercles en D1 segments
    for (let i = 0; i < D1; i++) {
        const angle = (i * 360) / D1;
        const x1 = CENTER_X + (R1 / 2) * Math.cos((angle * Math.PI) / 180);
        const y1 = CENTER_Y + (R1 / 2) * Math.sin((angle * Math.PI) / 180);
        const x2 = CENTER_X + (R2 / 2) * Math.cos((angle * Math.PI) / 180);
        const y2 = CENTER_Y + (R2 / 2) * Math.sin((angle * Math.PI) / 180);
      
        const theta = Math.atan2(y2 - y1, x2 - x1);

        // Ligne Ln - Not shown
        // svg.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2).attr("stroke", "black").attr("stroke-width", 1);

        // Ligne Ln'1
        // Points d'intersection décalés pour Ln'1 et Ln'2
        const parallel_x1 = x1 + O1 * Math.sin(theta);
        const parallel_y1 = y1 - O1 * Math.cos(theta);
        const parallel_x2 = x2 + O1 * Math.sin(theta);
        const parallel_y2 = y2 - O1 * Math.cos(theta);
        // svg.append("line").attr("x1", parallel_x1).attr("y1", parallel_y1).attr("x2", parallel_x2).attr("y2", parallel_y2).attr("stroke", "red").attr("stroke-width", 1);

        // Ligne Ln'1
        // Points d'intersection décalés pour Ln'1 et Ln'2
        const parallel_x4 = x1 + O2 * Math.sin(theta);
        const parallel_y4 = y1 - O2 * Math.cos(theta);
        const parallel_x3 = x2 + O2 * Math.sin(theta);
        const parallel_y3 = y2 - O2 * Math.cos(theta);
        // svg.append("line").attr("x1", parallel_x4).attr("y1", parallel_y4).attr("x2", parallel_x3).attr("y2", parallel_y3).attr("stroke", "red").attr("stroke-width", 1);
        // svg.append("circle").attr("cx", parallel_x1).attr("cy", parallel_y1).attr("r", 2).attr("fill", "black");
        // svg.append("circle").attr("cx", parallel_x2).attr("cy", parallel_y2).attr("r", 5).attr("fill", "black");
        // svg.append("circle").attr("cx", parallel_x3).attr("cy", parallel_y3).attr("r", 10).attr("fill", "black");
        // svg.append("circle").attr("cx", parallel_x4).attr("cy", parallel_y4).attr("r", 15).attr("fill", "black");

        points.push({x : parallel_x4, y : parallel_y4})
        points.push({x: parallel_x3, y : parallel_y3})
        points.push({x: parallel_x2, y : parallel_y2})
        points.push({x: parallel_x1, y : parallel_y1})
    }

 

    const rx = R1 / 2;
    const ry = R1 / 2;
    const xAxisRotation = 0;
    const largeArcFlag = 0;
    const sweepFlag = 1; // sens des aiguilles d'une montre

    let pathData = ''
    for (let index = 0; index < points.length; index++) {
      if (index === 0 ){
        // On commence le trait
        pathData = `M ${points[index].x} ${points[index].y} `;
      } else {
        if (index % 4 === 0) {
          // Arc de cercle suivant R1 jusqu'à X1,i+1
          pathData += `A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${points[index].x} ${points[index].y} `;
        } else {
          pathData += `L ${points[index].x} ${points[index].y} `;
        }
      }
    }

    pathData += `A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${points[0].x} ${points[0].y} `;
    pathData += `Z`;

    svg.append("path")
      .attr("d", pathData)
      .attr("stroke", "blue")
      .attr("fill", "none")
      .attr("stroke-width", 1);


    setSVG(svg);
  };

  const copyToClipboard = () => {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(SVG.node());

    navigator.clipboard.writeText(svgString).then(() => {
      console.log("Paste into the clipboard")
    }).catch(err => {
      console.error("Impossible de copier le texte: ", err);
    });
  };

  return (
    <div>
      <div>
        <label>R1: </label>
        <input type="number" value={R1} onChange={(e) => setR1(Number(e.target.value))} />
      </div>
      <div>
        <label>R2: </label>
        <input type="number" value={R2} onChange={(e) => setR2(Number(e.target.value))} />
      </div>
      <div>
        <label>Offset 1: </label>
        <input type="number" value={O1} onChange={(e) => setO1(Number(e.target.value))} />
      </div>
      <div>
        <label>Offset 2: </label>
        <input type="number" value={O2} onChange={(e) => setO2(Number(e.target.value))} />
      </div>
      <div>
        <label>D1: </label>
        <input type="number" value={D1} onChange={(e) => setD1(Number(e.target.value))} />
      </div>
      <button onClick={generateSVG}>Générer</button>
      <button onClick={copyToClipboard}>Copier dans le presse-papier</button>
      <div id="svg-container">
        <svg width={R1} height={R1}></svg>
      </div>
    </div>
  );
};

export default SvgGenerator;
