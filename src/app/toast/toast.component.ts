import { Component, OnInit } from '@angular/core';
import { MyService } from '../my.service';
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
 
  constructor(public myService:MyService) { }

  ngOnInit() {
  }

}
