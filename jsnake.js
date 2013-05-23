$(function() {
    $.widget("sjl.jsnake", {
	options: {
	    update_interval: 200,
	    initial_food: 10,
	    food_frequency: 0.05, // Interval from 0..1.
	    food_color: { r: 0, g: 0, b: 200 },
	    snake_color: { r: 200, g: 0, b: 0 }
	},

	// These double as character codes for the keypresses.
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,

	_add_food: function () {
	    var x = Math.floor(Math.random() * this._board_width);
	    var y = Math.floor(Math.random() * this._board_height);

	    console.log("adding food:", x, y);
	    if (!this._occupied_by_snake(x, y)) {
		this._draw_food(x, y);
	    }
	},

	_maybe_add_food: function () {
	    if (Math.random() < this.options.food_frequency) {
		this._add_food();
	    }
	},

	_create: function () {
	    var ctx = this.element[0].getContext("2d");
	    this._board_width = 50;
	    this._board_height = 50;

	    this._square_side = this.element.width()/this._board_width;
	    
	    this._x = Math.round(this._board_width/2);
	    this._y = Math.round(this._board_height/2);

	    this._valid_directions = [this.LEFT, this.RIGHT, 
				      this.DOWN, this.UP];
	    
	    this._direction = this.RIGHT;
	    
	    this._snake = [{x: this._x, y: this._y}];

	    if (ctx) {
		this.element.css("border", "1px solid black");
		setTimeout($.proxy(this.update, this), 
			   this.options.update_interval);
		this._ctx = ctx;		

		console.log("initial food: ", this.options.initial_food);
		for (var ii = 0; ii < this.options.initial_food; ii++)
		    this._add_food();

		$(document).on('keydown', 
				$.proxy(function (e) {
				    if (this._valid_directions.indexOf(
					e.which) != -1)
					this._change_direction(e.which);
				} , 
					this));
	    }
	},

	_change_direction: function (new_direction) {
	    this._direction = new_direction;
	},

	_clear_square: function (x, y) {
	    this._ctx.clearRect(x * this._square_side, y * this._square_side,
				this._square_side, this._square_side);
	},

	_draw_food: function (x, y) {
	    this._draw_square(x, y, this.options.food_color);
	},

	_draw_snake: function (x, y) {
	    this._draw_square(x, y, this.options.snake_color);
	},

	_draw_square: function (x, y, color) {
	    this._ctx.fillStyle = "rgb(" + 
			      color.r + "," + 
			      color.g + "," + 
			      color.b + ")";
	    this._ctx.fillRect(x * this._square_side, y * this._square_side,
			       this._square_side, this._square_side);
	},

	_get_square_color: function (x, y) {
	    var data = 
		this._ctx.getImageData(Math.floor((x + 0.5) * 
						  this._square_side), 
				       Math.floor((y + 0.5)* 
						  this._square_side)
				       , 1, 1).data;
	    return { r: data[0], g: data[1], b: data[2] };
	},

	_color_equal: function (c1, c2) {
	    return c1.r == c2.r && c1.g == c2.g && c1.b == c2.b;
	},

	_has_food: function (x, y) {
	    return this._color_equal(this._get_square_color(x, y),
				     this.options.food_color);
	},

	_occupied_by_snake: function (x, y) {
	    // XXX better idea would be to check the color of the map.
	    for (var ii = 0; ii < this._snake.length; ii++) {
		var joint = this._snake[ii];
		if (joint.x == x && joint.y == y)
		    return true;
	    }
	    return false;
	},

	_snake_still_legal: function () {
	    if (this._x < 0)
		return false;
	    if (this._x >= this._board_width)
		return false;
	    if (this._y < 0)
		return false;
	    if (this._y >= this._board_height)
		return false;

	    if (this._occupied_by_snake(this._x, this._y))
		return false;
	    return true;
	},
	
	_snake_should_grow: function () {
	    if (this._has_food(this._x, this._y)) {
		return true;
	    } else {
		return false;
	    }
	},

	// Return true if game over.
	_move_snake: function () {
	    switch (this._direction) {
		case this.LEFT:
		this._x--;
		break;
		case this.RIGHT:
		this._x++;
		break;
		case this.UP:
		this._y--;
		break;
		case this.DOWN:
		this._y++;
		break;
	    }

	    if (!this._snake_still_legal()) {	
		return true;
	    }

	    if (!this._snake_should_grow()) {
		var last = this._snake.pop();
		this._clear_square(last.x, last.y);
	    }

	    this._snake.unshift({ x: this._x, y: this._y })
	    this._draw_snake(this._x, this._y);
	    return false;
	},

	update: function () {
	    var at_end = this._move_snake();
	    if (!at_end) {
		this._maybe_add_food();
		setTimeout($.proxy(this.update, this), 
			   this.options.update_interval);
	    } else {
		alert("dead meat: " + this._snake.length);
	    }
	}
    });
});
