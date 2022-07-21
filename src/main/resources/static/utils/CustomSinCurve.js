export class CustomSinCurve extends THREE.Curve {

    constructor( scale = 1 ) {
        super();
        this.scale = scale;
    }

    getPoint( t, optionalTarget = new THREE.Vector3() ) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin( 2 * Math.PI * t );
        const tz = 0;

        return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
    }
}