import { ApiErrorCodeEnum } from '../../../../shared/model/error/api-error-code-enum.model';
import { ApiError } from '../../../../shared/model/error/api-error.model';
import { Story } from '../../../../shared/model/story/story.model';
import { NotificationService } from '../../../../shared/service/util/notification.service';
import { CreateStoryService } from '../create-story.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-step-title',
  templateUrl: './step-title.component.html',
  styleUrls: ['./step-title.component.scss']
})
export class StepTitleComponent implements OnInit {
  stepTitleForm: FormGroup;
  backendOperationInProgress: boolean;

  constructor(
    private createStoryService: CreateStoryService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.initCreateStory();
    this.initForm();
    this.backendOperationInProgress = false;
  }

  initCreateStory() {
    if (!this.createStoryService.story) {
      this.createStoryService.story = {};
    }
  }

  initForm() {
    // si une histoire était déjà en cours de création on reprend ses infos (par exemple si on revient de l'étape 2)
    const createStory = this.createStoryService.story;
    this.stepTitleForm = new FormGroup({
      'storyTitle': new FormControl(createStory && createStory.title ? createStory.title : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)]
      ),
      'storyIsOriginal': new FormControl(
        createStory && createStory.originalStory !== undefined ? createStory.originalStory : true,
        Validators.required)
    });
  }

  onNextStep(): void {
    this.saveStoryAndRedirect(['../etape-2']);
  }

  onFinish(): void {
    this.saveStoryAndRedirect(['../../accueil']);
  }

  private saveStoryAndRedirect(redirectTo: string[]) {
    this.backendOperationInProgress = true;

    this.createStoryService.initStoryStepTitle(this.stepTitleForm).subscribe(
      (response: number | Story) => {
        if (typeof response === 'number') {
          this.createStoryService.story.id = response;
          this.notificationService.success(`L'histoire <b><u>${this.stepTitleForm.value.storyTitle}</u></b> a bien été créée.`);
        } else {
          this.notificationService.success('Les informations de l\'histoire ont bien été mises à jour.');
        }
        this.backendOperationInProgress = false;
        this.router.navigate(redirectTo, { relativeTo: this.route });
      },
      (errorResponse: HttpErrorResponse) => {
        const apiError: ApiError = errorResponse.error;
        if (apiError.code === ApiErrorCodeEnum.TITLE_ALREADY_USED) {
          this.notificationService.error(`Une histoire existe déjà avec ce titre : <b><u>${this.stepTitleForm.value.storyTitle}</u></b>.`);
        } else {
          this.notificationService.error('Une erreur s\'est produite! Merci de réessayer plus tard ou de contacter le support',
            'Erreur technique');
        }
        this.backendOperationInProgress = false;
      }
    );
  }
}
