import React, { Component } from 'react'
import * as THREE from 'three'
import './background.css'

class Background extends Component {
  state={
    height: "100%"
  }
  componentWillUnmount(){
    for(let i = 0; i < this.scene.children.length; i++){
      this.scene.children[i].geometry.dispose()
      this.scene.children[i].material.dispose()
      this.scene.remove(this.scene.children[i])
    }
  }
  componentDidMount() {
    //basic threejs stuff
    this.init()
  

    this.animate = function () {
      requestAnimationFrame(this.animate.bind(this))
      this.objectRender()
      this.renderer.render(this.scene, this.camera)
    }

    this.animate()

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    window.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );
    window.addEventListener( 'mouseup', this.onDocumentMouseUp.bind(this), false );
    window.addEventListener('contextmenu', (e) => {this.onDocumentRightMouseUp(e)}, false)
  }

  //initialize threejs
  init = () => {
    //settings
    this.rotated = false
    this.actionZ = 0; //on left click action
    this.rotationA = 3.1; // amount of rotation
    this.movementSpeed = 10;
    this.zoomSpeed = -10;
    this.totalObjects = 40000;
    //basic stuff
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000)
    this.camera.position.z = 2000
    this.scene.fog = new THREE.FogExp2( 0x555555, 0.0003 );  
    this.geometry = new THREE.Geometry();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
    for (let i = 0; i < this.totalObjects; i ++) { 
        var vertex = new THREE.Vector3();
        vertex.x = Math.random()*40000-20000;
        vertex.y = Math.random()*7000-3500;
        vertex.z = Math.random()*7000-3500;
        this.geometry.vertices.push( vertex );
    }
    this.material = new THREE.ParticleBasicMaterial( { size: 6 });
    this.particles = new THREE.ParticleSystem( this.geometry, this.material );
    this.scene.add(this.particles)
    this.camera.position.x = -10000
  }
      
  onWindowResize() {
      if (this.mount) {
        this.camera.aspect = window.innerWidth/window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.setState({height: window.innerHeight})
      }
    }

  onDocumentMouseDown = () => {
    this.actionZ = this.zoomSpeed;
  }
  onDocumentMouseUp = () => {
    this.actionZ = 0
  }
  onDocumentRightMouseUp = (e) => {
    e.preventDefault()
    this.actionZ = -this.zoomSpeed;
  }
  objectRender = () => {
    if (!this.rotated && this.camera.position.x < 11000)
        {
          if(this.camera.position.x > 10000){
            this.rotated = true;
            if (this.camera.rotation.y < this.rotationA){
              this.camera.rotation.y += .015;
              this.rotated = false;
            }
            if (this.camera.position.z > -2000){
              this.camera.position.z -= 19;
              this.rotated = false;
            }
          }
          else{
            this.camera.position.x += this.movementSpeed;
            this.camera.position.z += this.actionZ;
          }
        }
    else if(this.rotated && this.camera.position.x > -11000){
        if(this.camera.position.x < -10000){
            this.rotated = false;
            if (this.camera.rotation.y > 0){
              this.camera.rotation.y -= .015;
              this.rotated = true;
            }
            if (this.camera.position.z < 2000){
              this.camera.position.z += 19;
              this.rotated = true;
            }
          }
          else{
            this.camera.position.x -= this.movementSpeed;
            this.camera.position.z -= this.actionZ;
          }
        }
  }

  render() {
    return (
      <div style={{ width: `100%`, height: `auto`}}>
      </div>
    )
  }
}

export default Background