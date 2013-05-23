$(function() {
    $.widget("sjl.jsnake", {
	options: {
	    update_interval: 500
	},

	// These double as character codes for the keypresses.
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,

	_create: function () {
	    var ctx = this.element[0].getContext("2d");
	    this._board_width = 50;
	    this._board_height = 50;
	    
	    this._x = Math.round(this._board_width/2);
	    this._y = Math.round(this._board_height/2);

	    this._valid_directions = [this.LEFT, this.RIGHT, 
				     this.DOWN, this.UP];
	    
	    this._direction = this.RIGHT;
	    
	    this._snake = [{x: this._x, y: this._y,
			    direction: this._direction}];

	    if (ctx) {
		this.element.css("border", "1px solid black");
		setTimeout($.proxy(this.update, this), 
			   this.options.update_interval);
		this._square_side = this.element.width()/this._board_width;
		this._ctx = ctx;
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

	_draw_square: function (x, y) {
	    this._ctx.fillStyle = "rgb(200, 0, 0)";
	    this._ctx.fillRect(x * this._square_side, y * this._square_side,
			       this._square_side, this._square_side);
	},

	_occupied_by_snake: function (x, y) {
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
	    if (this._x > this._board_width)
		return false;
	    if (this._y < 0)
		return false;
	    if (this._y > this._board_height)
		return false;

	    if (this._occupied_by_snake(this._x, this._y))
		return false;
	    return true;
	},
	
	_grow_counter: 0,

	_snake_should_grow: function () {
	    return this._grow_counter++ % 3;
	},

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

	    if (!this._snake_should_grow()) {
		var last = this._snake.pop();
		this._clear_square(last.x, last.y);
	    }

	    if (this._snake_still_legal()) {	
		this._snake.unshift({x: this._x, y: this._y,
				     direction: this._direction})
		this._draw_square(this._x, this._y);
		return false;
	    } else {
		return true;
	    }
	},

	update: function () {
	    var at_end = this._move_snake();
	    if (!at_end) {
		setTimeout($.proxy(this.update, this), 
			   this.options.update_interval);
	    } else {
		alert("dead meat.");
	    }
	}
    });
});
