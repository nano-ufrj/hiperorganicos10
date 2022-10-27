let config = {
    sensor_distance     : 6,//15
    sensor_angle        : 40/180*Math.PI, // radians
    turning_speed       : 0.3,//40/180*Math.PI; // radians
    speed               : 6,
    decay_factor        : 0.8,
    deposit_amount      : 0.4,
    num_agents          : 4000,
    start_in_circle     : true, // otherwise start randomly
    random_turning      : false, // randomly turn within the limits of turning_speed
    wrap_around         : true
    //highlight_agents: false,
}

export default config;