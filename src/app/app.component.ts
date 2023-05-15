import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ipAddress: string = '';
  gasLimit: number = 80000;
  fee: number = 2000;
  containerClicked: boolean = false;
  nameSpaceId: string = '';
  data: string = '';
  downloadLink: string | undefined;
  isLoading: boolean = false;


  constructor(private http: HttpClient) {
  }

  //creating name space id and data.
  async generateRandomHex(len: number): Promise<string> {
    const bytes = new Uint8Array(len);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  async generateRandomMessage(): Promise<string> {
    const len = Math.floor(Math.random() * 100);
    return this.generateRandomHex(len);
  }

  async generateNameAndData(): Promise<void> {
    let namespaceID = await this.generateRandomHex(8);
    const data = await this.generateRandomMessage();
    this.nameSpaceId = namespaceID;
    this.data = data;


  }

  downloadResponseAsTextFile(content: string | undefined): void {
    if (!content) {
      console.error('Empty content, cannot download as a text file.');
      return;
    }
    const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    this.downloadLink = url;
  }
    
 async sendPFB(): Promise<void> {
        this.isLoading=true;

    const url = `http://${this.ipAddress}:8080/pfb`;
    const data = {
      namespace_id: this.nameSpaceId,
      data: this.data,
      gas_limit: this.gasLimit,
      fee: this.fee,
      ip_address: this.ipAddress,
    };
    try {
      const response = await this.http.post(url, JSON.stringify(data), {responseType: 'text'}).toPromise();
      this.downloadResponseAsTextFile(response)
      alert("Successful")
          this.isLoading=false;

    } catch (error) {
      console.error('Error:', error);
      alert('Pfb has not gone trough make sure you have enough tia' + error);
          this.isLoading=false;

    }
  }

}
