module Jekyll
    module AbsoluteUrlFilter
      # Converts relative image paths (starting with "./") to absolute URLs.
      # Expects a base URL to be passed in (e.g. the post's base path).
      def absolute_img_urls(input, base_url = '')
        site_url = @context.registers[:site].config['url']
        base_url = base_url.to_s
        base_url += '/' if base_url != '' && !base_url.end_with?('/')
        # Replace occurrences of src="./..." with an absolute URL.
        input.gsub(/src="\.\/([^"]+)"/) do
          "src=\"#{site_url}#{base_url}#{$1}\""
        end
      end
    end
  
    module PostBaseUrlFilter
      # Computes the base path for a post.
      def post_base_url(post_url)
        if post_url.end_with?(".html")
          base = File.dirname(post_url)
          base = '/' if base == '.'
          base += '/' unless base.end_with?('/')
          base
        else
          post_url
        end
      end
    end
  end
  
  Liquid::Template.register_filter(Jekyll::AbsoluteUrlFilter)
  Liquid::Template.register_filter(Jekyll::PostBaseUrlFilter)
  