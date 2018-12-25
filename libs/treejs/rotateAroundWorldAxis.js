THREE.Object3D.prototype.rotateAroundWorldAxis = function() {

    var q1 = new THREE.Quaternion();
    return function ( point, axis, angle ) {

        q1.setFromAxisAngle( axis, angle );

        this.quaternion.multiplyQuaternions( q1, this.quaternion );

        this.position.sub( point );
        this.position.applyQuaternion( q1 );
        this.position.add( point );

        return this;
    }

}();