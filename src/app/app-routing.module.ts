import { NgModule } from '@angular/core';
import { Event, Router, RouterModule, Routes, Scroll } from '@angular/router';
import { HomeComponent } from '@app/pages/home.component';
import { LibraryComponent } from '@app/pages/library.component';
import { SearchComponent } from '@app/pages/search.component';
import { HistoryComponent } from '@app/pages/history.component';
import { ExplorerComponent } from '@app/pages/explorer.component';
import { LibrarySettingsComponent } from '@app/dialogs/library-settings.component';
import { SettingsComponent } from '@app/dialogs/settings.component';
import { ScanComponent } from '@app/dialogs/scan.component';
import { PageAlbumComponent } from '@app/pages/page-album.component';
import { PageAlbumResolverService } from '@app/resolvers/page-album-resolver.service';
import { PageArtistComponent } from '@app/pages/page-artist.component';
import { PageArtistResolverService } from '@app/resolvers/page-artist-resolver.service';
import { LibraryAlbumsComponent } from '@app/pages/library-albums.component';
import { LibraryArtistsComponent } from '@app/pages/library-artists.component';
import { ViewportScroller } from '@angular/common';
import { concatMap, delay, filter, retry } from 'rxjs/operators';
import { LibraryPlaylistsComponent } from '@app/pages/library-playlists.component';
import { LibrarySongsComponent } from '@app/pages/library-songs.component';
import { defer, EMPTY, of, throwError } from 'rxjs';
import { PlaylistNewComponent } from '@app/dialogs/playlist-new.component';
import { PagePlaylistComponent } from '@app/pages/page-playlist.component';
import { PagePlaylistResolver } from '@app/resolvers/page-playlist-resolver.service';
import { PagePlaylistLikesComponent } from '@app/pages/page-playlist-likes.component';
import { PlayerComponent } from '@app/components/player.component';
import { PlayComponent } from '@app/pages/play.component';
import { PlayerResolverService } from '@app/resolvers/player-resolver.service';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { animation: 'default' } },
  { path: 'home', component: HomeComponent, data: { animation: 'default' } },
  {
    path: 'history',
    component: HistoryComponent,
    data: { animation: 'default' },
  },
  {
    path: 'explorer',
    component: ExplorerComponent,
    data: { animation: 'default' },
  },
  {
    path: 'library',
    component: LibraryComponent,
    data: { animation: 'default' },
    children: [
      { path: '', redirectTo: 'albums', pathMatch: 'full' },
      { path: 'playlists', component: LibraryPlaylistsComponent },
      { path: 'albums', component: LibraryAlbumsComponent },
      { path: 'artists', component: LibraryArtistsComponent },
      { path: 'songs', component: LibrarySongsComponent },
    ],
  },
  {
    path: 'search',
    component: SearchComponent,
    data: { animation: 'default' },
  },
  {
    path: 'album/:id',
    component: PageAlbumComponent,
    data: { animation: 'default' },
    resolve: { info: PageAlbumResolverService },
  },
  {
    path: 'artist/:id',
    component: PageArtistComponent,
    data: { animation: 'default' },
    resolve: { info: PageArtistResolverService },
  },
  {
    path: 'likes',
    data: { animation: 'default' },
    component: PagePlaylistLikesComponent,
  },
  {
    path: 'play',
    component: PlayComponent,
    data: { animation: 'PlayPage' },
  },
  {
    path: 'playlist/:id',
    component: PagePlaylistComponent,
    data: { animation: 'default' },
    resolve: { info: PagePlaylistResolver },
  },
  {
    outlet: 'dialog',
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'library', pathMatch: 'full' },
      { path: 'library', component: LibrarySettingsComponent },
    ],
  },
  {
    outlet: 'dialog',
    path: 'scan',
    component: ScanComponent,
  },
  {
    outlet: 'dialog',
    path: 'new-playlist',
    component: PlaylistNewComponent,
  },
  {
    outlet: 'player',
    path: ':type/:id',
    component: PlayerComponent,
    resolve: { info: PlayerResolverService },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'corrected',
      scrollPositionRestoration: 'disabled',
      // anchorScrolling: 'enabled',
      // onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    router.events
      .pipe(filter((e: Event): e is Scroll => e instanceof Scroll))
      .subscribe((e) => {
        if (e.position) {
          // backward navigation
          const p = e.position;
          // viewportScroller.scrollToPosition(p);

          const getPos$ = defer(() => of(viewportScroller.getScrollPosition()));
          const scroll$ = defer(() => of(viewportScroller.scrollToPosition(p)));

          scroll$
            .pipe(
              delay(10),
              concatMap(() =>
                getPos$.pipe(
                  concatMap((pos) =>
                    pos[1] === p[1]
                      ? EMPTY
                      : throwError('position not matching')
                  )
                )
              ),
              retry(50)
            )
            .subscribe();

          // setTimeout(() => viewportScroller.scrollToPosition(p), 100);
          // setTimeout(() => viewportScroller.scrollToPosition(p), 200);
        } else if (e.anchor) {
          // anchor navigation
          viewportScroller.scrollToAnchor(e.anchor);
        } else {
          const a = [/library.+#top/, /library.+\(player:.+\).*/, /\/play\(/];
          // forward navigation
          if (!a.find((l) => l.test(e.routerEvent.url))) {
            viewportScroller.scrollToPosition([0, 0]);
          }
        }
      });
  }
}
