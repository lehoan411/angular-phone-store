import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet, Router } from '@angular/router';
import { ProductItem } from '../shared/type/productItem';
import { ProductService } from '../../services/ProductService';
import { CartService } from '../../services/CartService';
import { CurrencyPipe } from '../shared/pipes/CurencyPipe.pipe';
import { UpperCasePipe } from '../shared/pipes/UpperCasePipe.pipe';
import { LocalStorageService } from '../shared/storage/local-storage.service';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../shared/comment/comment.component';
import { CommentService } from '../../services/CommentService';
import { UserService } from '../../services/UserService';
import { ChangeDetectorRef } from '@angular/core';
import { forkJoin, map } from 'rxjs';
@Component({
  selector: 'detail-root',
  standalone: true,
  imports: [UpperCasePipe, CurrencyPipe, CommonModule, CommentComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit {
  id = '';
  productItem: ProductItem = {
    id: '',
    user: '',
    image: [] as string[],
    name: '',
    price: 0,
  }
  currentUserId: string | null = null;
  commentViews: any[] = [];
  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private localStorage: LocalStorageService,
    private CommentService: CommentService,
    private userService: UserService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const token = this.localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token));
      this.currentUserId = decoded.id;
    }
    this.id = this.route.snapshot.params['id'];
    this.loadProduct();
    this.loadComments();
  }

  selectedImageIndex = 0;

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  loadProduct() {
    this.productService.detailProduct(this.id).subscribe(res => {
      this.productItem = res;
    });
  }

  loadComments() {
    this.CommentService.getCommentsByProduct(this.id).subscribe(comments => {

      const requests = comments.map((cmt: any) =>
        this.userService.getUserById(cmt.user).pipe(
          map((user: any) => ({
            ...cmt,
            username: user.username,
            avatar: user.avatar || ''
          }))
        )
      );

      forkJoin(requests).subscribe((result) => {
        this.commentViews = result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      });
    });
  }


  sendComment(content: string) {
    const token = this.localStorage.getItem("token");
    if (!token) {
      alert("Please log in to comment.");
      return;
    }

    const user = JSON.parse(atob(token));

    const newComment = {
      id: String(Math.random()),
      user: user.id,
      username: user.username,
      avatar: user.avatar || '',
      product: this.id,
      content: content,
      date: new Date().toISOString()
    };
    this.commentViews.unshift(newComment);
    this.CommentService.addComment(newComment).subscribe();
  }


  updateComment(data: { id: string, content: string }) {

    const token = this.localStorage.getItem("token");
    if (!token) return;

    const user = JSON.parse(atob(token));

    this.CommentService.editComment({
      id: data.id,
      user: user.id,
      product: this.id,
      content: data.content,
      date: new Date().toISOString()
    }).subscribe(() => {
      const index = this.commentViews.findIndex(c => c.id === data.id);
      if (index !== -1) {
        this.commentViews[index] = {
          ...this.commentViews[index],
          content: data.content,
          date: new Date().toISOString()
        };
        this.cd.detectChanges();
      }
    });
  }

  deleteComment(id: string) {
    if (!confirm("Delete this comment?")) return;

    this.CommentService.deleteComment(id).subscribe(() => {
      this.commentViews = this.commentViews.filter(c => c.id !== id);
      this.cd.detectChanges();
    });
  }

  handleAddToCart() {
    const userData = this.localStorage.getItem('token');
    if (!userData) {
      alert('Please log in to add items to your cart.');
      return;
    } else if (userData && JSON.parse(atob(userData)).role === 'admin') {
      this.router.navigate(['/admin/manage-product']);
      return;
    }
    const cartItem = {
      id: String(Math.random()),
      user: JSON.parse(atob(userData)).id.toString(),
      product: this.productItem.id
    }
    this.cartService.addToCart(cartItem).subscribe((res: any) => {
      if (res.id) {
        alert('Product added to cart successfully!');
      }
    });
  }

}
