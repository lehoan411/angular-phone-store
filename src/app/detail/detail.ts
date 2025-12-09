import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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
    image: '',
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
    private userService: UserService
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

  loadProduct() {
    this.productService.detailProduct(this.id).subscribe(res => {
      this.productItem = res;
    });
  }

  loadComments() {
    this.CommentService.getCommentsByProduct(this.id).subscribe(comments => {
      this.commentViews = [];

      comments.forEach((cmt: any) => {
        this.userService.getUserById(cmt.user).subscribe(user => {
          this.commentViews.push({
            ...cmt,
            username: user.username,
          });
        });
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

    const payload = {
      id: String(Math.random()),
      user: user.id,
      product: this.id,
      content: content,
      date: new Date().toISOString()
    };

    this.CommentService.addComment(payload).subscribe(() => {
      this.loadComments();
      window.location.reload();
    });
  }


  updateComment(data: { id: string, content: string }) {
    const token = this.localStorage.getItem("token");

    if (!token) {
      alert("Please log in to comment.");
      return;
    }

    const user = JSON.parse(atob(token));
    this.CommentService.editComment({
      id: data.id,
      user: user.id,
      product: this.id,
      content: data.content,
      date: new Date().toISOString()
    }).subscribe(() => {
      this.loadComments();
      window.location.reload();
    });
  }

  deleteComment(id: string) {
    if (!confirm("Delete this comment?")) return;

    this.CommentService.deleteComment(id).subscribe(() => {
      this.loadComments();
      window.location.reload();
    });
  }

  handleAddToCart() {
    const userData = this.localStorage.getItem('token');
    if (!userData) {
      alert('Please log in to add items to your cart.');
      return;
    } else if (userData && JSON.parse(atob(userData)).role === 'admin') {
      window.location.href = '/admin/manage-product';
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
