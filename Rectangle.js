function Rectangle(pX, pY, pWidth, pHeight)
{
  this.x = pX;
  this.y = pY;
  this.width = pWidth;
  this.height = pHeight;
  this.left = pX;
  this.top = pY;
  this.right = pX + pWidth;
  this.bottom = pY + pHeight;

  this.contains = function(x, y)
  { 
    var result = false;

    if ((x >= this.left) && (x <= this.right) && (y >=  this.top) && (y <= this.bottom)) 
    {
      result = true; 
    } 
    return result;
  } 
  
  this.isEmpty = function()
  {
    var result = false;
    
    if ((this.x == undefined) || (this.y == undefined) || (this.width == undefined) || (this.height == undefined))
    {
      result = true;  
    }
    return result;
  }

}

function intersect(a, b)
{ 
  var result = new Rectangle();

  if (false == ((a.left > b.right) || (a.top > b.bottom) || (a.right < b.left) || (a.bottom < b.top)))
  {
    result.x = Math.max(a.left, b.left);
    result.y = Math.max(a.top, b.top);
    result.left = result.x;
    result.top = result.y;
    result.right = Math.min(a.right, b.right);
    result.bottom = Math.min(a.bottom, b.bottom);
    result.width = result.right - result.x;
    result.height = result.bottom - result.y;
  }
  return result;
}
