Rails.application.routes.draw do
  root 'users#index'
  resources :users
  get "/service-worker.js" => "service_worker#service_worker"
  get "/manifest.json" => "service_worker#manifest"
end
