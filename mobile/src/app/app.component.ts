import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {HttpService} from "./service/http.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  height: number = document.documentElement.clientHeight;
  state = {
    open: false
  };

  constructor(private httpService: HttpService,
              private router: Router) { }

  ngOnInit() {
    this.getInfo();
    this.initNavigation();
    this.getCount();
  }

  onOpenChange(event) {
    this.state.open = !this.state.open;
  }

  public username: string;
  public avatar: string;

  public navigations: any[] = [];

  public articleCount: number = 0;
  public categoryCount: number = 0;

  /**
   * 获得用户信息
   */
  getInfo(): void {
    this.httpService.get("/user")
      .subscribe((data) => {
        this.username = data.data['username'];
        this.avatar = data.data['avatar'];
      });
  }

  /**
   * 初始化导航数据
   */
  initNavigation(): void {
    this.httpService.get("/navigation")
      .subscribe( (data) => {
        this.navigations = data.data;
      });
  }

  /**
   * 切换导航
   * @param {string} url
   */
  public changeCategory(url: string) {
    if (url == '') {
      this.router.navigateByUrl("/");
      this.state.open = !this.state.open;
    } else {
      this.router.navigateByUrl("/transition")
        .then(() => {
          this.router.navigate([url]);
          this.state.open = !this.state.open;
        });
    }

  }

  /**
   * 获取数量
   */
  public getCount(): void {
    // 获取文章的总数量
    this.httpService.get("/article/count")
      .subscribe((data) => {
        if (data.code % 2) {
          this.articleCount = data.data;
        } else {
          this.articleCount = 26;
        }
      });

    // 获取分类的总个数
    this.httpService.get("/category/count")
      .subscribe((data) => {
        if (data.code % 2) {
          this.categoryCount = data.data;
        } else {
          this.articleCount = 18;
        }
      });
  }
}
