app.directive
(
	'shareLink',
	function()
	{
		return {
			restrict: 'A',
			link: function(scope,element,attrs)
			{
				var params = {relativeMediaUrls:false};

				if( attrs.type == 'facebook' )
				{
					var link = attrs.fbLink.replace(/\s/g,'%20');

					element.click
					(
						function()
						{
							FB.ui
							(
								{
								 	method: 'feed',
								  	link: link,
								  	caption: attrs.fbCaption,
								  	descriptions: attrs.fbDescription,
								  	picture: attrs.fbPicture,
								}, 
								function(response){}
							);
						}
					);
				}
				else
				{
					$(element).storyShare();
				}
			}
		}
	}
);