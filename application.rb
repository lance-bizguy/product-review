require 'rubygems'
require 'json/pure'
require 'sinatra'
require 'rest_client'
require 'pp'

OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
#require 'mysql'
enable :sessions
set :port, 80
set :bind, 'ec2-54-204-200-205.compute-1.amazonaws.com'

set :sockets, []

ROOT = File.expand_path(File.dirname(__FILE__))

get '/' do
  File.read(File.join('public', 'dashboard.html'))
end

get '/dashboard' do
  File.read(File.join('public', 'dashboard.html'))
end

get '/search/:id' do
  res = RestClient.get "http://walmartlabs.api.mashery.com/v1/search?categoryId=3944_1078524_1077944&query=%22iPad+Air%22&format=json&apiKey=mexpnumdgwrbjrafxyrfjnjv", :content_type => :json, :accept => :json
end

get '/items' do
  items = []
  items.push({:id => 30146213, :name => "Apple iPad Air 16GB with Wi-Fi Silver", :other => 1219074892314})
  items.push({:id => 30146216, :name => "Apple iPad Air 32GB with Wi-Fi Silver", :other => 1219074893080})
  items.push({:id => 30146220, :name => "Apple iPad Air 64GB with Wi-Fi Silver", :other => 1219063713878})
  items.push({:id => 30146222, :name => "Apple iPad Air 16GB with Wi-Fi AT&T Silver", :other => 1219074713112})
  items.push({:id => 30146224, :name => "Apple iPad Air 32GB with Wi-Fi AT&T Silver", :other => 1219074709061})
  items.push({:id => 30146226, :name => "Apple iPad Air 64GB with Wi-Fi AT&T Silver", :other => 1218931026938})

  items.to_json

end

get '/item/:id' do
  res = RestClient.get "http://walmartlabs.api.mashery.com/v1/items/#{params[:id]}?format=json&apiKey=mexpnumdgwrbjrafxyrfjnjv", :content_type => :json, :accept => :json
end

get '/competitor/item/:id' do
  items = []
  items.push({:id => 30146213, :name => "Apple iPad Air 16GB with Wi-Fi Silver", :other => 1219074892314})
  items.push({:id => 30146216, :name => "Apple iPad Air 32GB with Wi-Fi Silver", :other => 1219074893080})
  items.push({:id => 30146220, :name => "Apple iPad Air 64GB with Wi-Fi Silver", :other => 1219063713878})
  items.push({:id => 30146222, :name => "Apple iPad Air 16GB with Wi-Fi AT&T Silver", :other => 1219074713112})
  items.push({:id => 30146224, :name => "Apple iPad Air 32GB with Wi-Fi AT&T Silver", :other => 1219074709061})
  items.push({:id => 30146226, :name => "Apple iPad Air 64GB with Wi-Fi AT&T Silver", :other => 1218931026938})

  items.each do | item |
    pp item[:id]
    pp params[:id].to_i
    if item[:id] == params[:id].to_i
      res = RestClient.get "http://api.remix.bestbuy.com/v1/products(productId=#{item[:other]})?apiKey=25aae5za54knebrxtp9sh27c&format=json", :content_type => :json, :accept => :json
      data = JSON.parse(res)
      pp data["products"]
      return data["products"][0].to_json
    end
  end
end

