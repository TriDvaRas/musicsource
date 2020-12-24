import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Optional,
} from '@angular/core';
import { Icons } from '../utils/icons.util';
import { PlayerState } from './player-button.component';

@Component({
  selector: 'app-playlist',
  template: `
    <app-cover
      [title]="name"
      [menuItems]="menuItems"
      [coverRouterLink]="playlistRouterLink"
      [playerState]="state"
      (playClicked)="play()"
      (pauseClicked)="pause()"
      tabindex="-1"
    >
      <img [src]="cover" height="226" width="226" alt="cover" />
    </app-cover>
    <app-label
      [topLabel]="{ text: name, routerLink: playlistRouterLink }"
      [bottomLabel]="label"
    ></app-label>
  `,
  styles: [
    `
      :host,
      img {
        display: block;
        max-width: 226px;
      }
      app-cover {
        margin-bottom: 16px;
        background-color: #333;
      }
      app-icon {
        color: #66bf3c;
      }
      .my-mix,
      .number {
        font-family: Arial, sans-serif;
        font-weight: 400;
        font-size: 32px;
        letter-spacing: 1px;
        position: absolute;
        bottom: 4px;
        left: 10px;
      }
      .number {
        top: 0;
        right: 8px;
        bottom: initial;
        left: initial;
        font-size: 78px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistComponent {
  @Input() cover!: string;
  @Input() name!: string;
  @Input() label!: string;
  @Input() playlistRouterLink!: any[] | string;
  @Input() artistRouterLink!: any[] | string;
  icons = Icons;
  menuItems = [
    {
      icon: Icons.shuffle,
      text: 'Shuffle play',
      click: () => alert('clicked'),
    },
    {
      icon: Icons.radio,
      text: 'Start radio',
    },
    {
      icon: Icons.playlistPlay,
      text: 'Play next',
      // click: () => (menuItems[0].icon = Icons.heartOutline),
    },
    {
      icon: Icons.playlistMusic,
      text: 'Add to queue',
    },
    {
      icon: Icons.heartOutline,
      text: 'Add to favorites',
    },
    {
      icon: Icons.playlistPlus,
      text: 'Add to playlist',
    },
  ];
  state: PlayerState = 'stopped';

  constructor(@Optional() private cdr: ChangeDetectorRef) {}

  play() {
    this.state = 'loading';
    setTimeout(() => {
      this.state = 'playing';
      this.cdr.markForCheck();
    }, 1000);
  }

  pause() {
    this.state = 'stopped';
  }
}
