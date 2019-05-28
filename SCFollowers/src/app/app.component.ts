import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title:'SCFollowers';
  scURL = "https://api-v2.soundcloud.com/users/2751638/followers?offset=1558219030595&limit=100&client_id=btkf2cRquT0ttPmKTPIIZ0o4bgjVAhcT&app_version=1558955000&app_locale=en";
  followers = [];
  stop = false;

  constructor(private HttpClient:HttpClient ){

  }

  ngOnInit(){
    
  }

  Stop(){
    this.stop=true;
  }

  async getFollowers(){
    if(this.scURL.length >0){
      
      //  Change the string around
      let offsetRegex = /offset=\d*/;
      let limitRegex = /limit=\d*/;

      this.scURL = this.scURL.replace(offsetRegex,'offset=0');
      this.scURL = this.scURL.replace(limitRegex,'limit=100');

      let response = await <any>this.HttpClient.get(this.scURL).toPromise();
      console.dir(response);
      let next_href = this.scURL.replace(offsetRegex,response.next_href.match(offsetRegex));
      this.followers = this.followers.concat(response.collection);
      console.dir(next_href);
      while(next_href && !this.stop){
        let response = await <any>this.HttpClient.get(next_href).toPromise();
        console.dir(response);
        next_href = this.scURL.replace(offsetRegex,response.next_href.match(offsetRegex));
        console.dir(next_href);
        this.followers = this.followers.concat(response.collection);
        this.followers = this.followers.sort((a,b) => {
          return  b.followers_count - a.followers_count;
        })
      }
    }
  }
}
