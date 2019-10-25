
import { Story } from 'src/app/shared/model/story.model';
import { MemberDetails } from './member-details.model';

export class Member {

  id: number;
  nickname: string;
  email: string;
  storiesCount: number;
  stories: Story[]; // ne sera pas toujours chargé, parfois on se contentera de storiesCount

  memberDetails: MemberDetails;

  constructor() { }

}
