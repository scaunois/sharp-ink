import { ApiService } from './util/api.service';
import { EndpointEnum } from '../constant/endpoint.enum';
import { StoryPublicationStatusEnum } from '../constant/story-publication-status.enum';
import { StorySearchCriteria } from '../model/story-search-criteria.model';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Story } from 'src/app/shared/model/story/story.model';

@Injectable()
export class StoryService {

  allStories: Story[] = [];
  allStoriesSubject = new Subject<Story[]>();

  constructor(
    private apiService: ApiService
  ) { }

  /**
   * Force le chargement de la liste des histoires si elle n'avait pas encore été initialisée,
   * et transmet les changements à tous ceux ayant souscrit à l'Observable.
   */
  loadAllStories() {
    const storySearchCriteria: StorySearchCriteria = {
      publicationStatus: StoryPublicationStatusEnum.PUBLISHED
    };

    if (this.allStories.length === 0) {
      this.getAllStoriesHttpObservable(storySearchCriteria).subscribe(
        (stories: Story[]) => {
          this.allStories = stories;
          this.allStoriesSubject.next(this.allStories);
        }
      );
    } else {
      this.allStoriesSubject.next(this.allStories);
    }
  }

  /**
   * Requête pour récupérer toutes les Story depuis le backend.
   * Remarque : ça ne charge ni l'auteur (seulement son id) ni les chapitres (seulement leur nombre).
   * Remarque 2 : on peut passer des paramètres (des filtres) qui affineront la recherche.
   */
  getAllStoriesHttpObservable(storySearchCriteria: StorySearchCriteria): Observable<Story[]> {
    const queryParams = <any>{};

    if (storySearchCriteria.count) {
      queryParams.count = storySearchCriteria.count;
    }
    if (storySearchCriteria.sort) {
      queryParams.sort = storySearchCriteria.sort;
    }
    queryParams.published = StoryPublicationStatusEnum.toOptionalBoolean(storySearchCriteria.publicationStatus);

    return this.apiService.get<Story[]>(EndpointEnum.STORIES, { params: queryParams });
  }

  /**
   * Retrieves a story by id from the backend.
   * Note: does not retrieve author (only his id), neither chapters (only chapters count + first chapter)
   */
  getStoryById(id: number): Observable<Story> {
    return this.apiService.get<Story>(`${EndpointEnum.STORIES}/${id}`);
  }
}
