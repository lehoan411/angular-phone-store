import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class CommentComponent {

    @Input() productId: string = "";
    @Input() commentViews: any[] = [];
    @Input() reloadComments!: () => void;
    @Input() currentUserId: string | null = null;

    newComment: string = "";
    editingId: string | null = null;
    editValue: string = "";
    isExpanded: { [key: string]: boolean } = {};

    constructor() { }

    @Output() onSendComment = new EventEmitter<string>();
    @Output() onUpdateComment = new EventEmitter<{ id: string, content: string }>();
    @Output() onDeleteComment = new EventEmitter<string>();

    toggleExpand(id: string) {
        this.isExpanded[id] = !this.isExpanded[id];
    }

    handleSend() {
        if (!this.newComment.trim()) return;

        this.onSendComment.emit(this.newComment.trim());
        this.newComment = "";
    }
    startEdit(cmt: any) {
        this.editingId = cmt.id;
        this.editValue = cmt.content;
    }

    saveEdit(id: string) {
        if (!this.editValue.trim()) return;
        this.onUpdateComment.emit({ id, content: this.editValue.trim() });
        this.editingId = null;
    }

    cancelEdit() {
        this.editingId = null;
    }

    deleteComment(id: string) {
        this.onDeleteComment.emit(id);
    }

}