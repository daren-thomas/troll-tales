Jekyll::Hooks.register [:pages, :posts], :post_render do |doc|
    # Only perform the replacement when in production mode
    if Jekyll.env == 'production' && doc.output_ext == '.html'
      site_url = doc.site.config['url'] || ''
  
      # Determine the base path for the current document.
      base_path = doc.url
      unless base_path.end_with?('/')
        base_path = File.dirname(base_path)
        base_path = '/' if base_path == '.'
        base_path += '/' unless base_path.end_with?('/')
      end
  
      # Replace image src paths that start with "./"
      doc.output.gsub!(/src="\.\/([^"]+)"/) do
        "src=\"#{site_url}#{base_path}#{$1}\""
      end
    end
  end
  