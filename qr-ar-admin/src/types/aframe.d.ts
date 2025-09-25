/// <reference types="react" />

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          embedded?: boolean;
          "vr-mode-ui"?: string;
          renderer?: string;
          "device-orientation-permission-ui"?: string;
          "mindar-image"?: string;
        },
        HTMLElement
      >;
      "a-entity": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: string;
          rotation?: string;
          scale?: string;
          "gltf-model"?: string;
          animation?: string;
          shadow?: string;
          cursor?: string;
          "mindar-image-target"?: string;
          light?: string;
        },
        HTMLElement
      >;
      "a-camera": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: string;
          "look-controls"?: string;
          "wasd-controls"?: string;
        },
        HTMLElement
      >;
      "a-video": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          width?: string;
          height?: string;
          position?: string;
          rotation?: string;
        },
        HTMLElement
      >;
      "a-image": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          width?: string;
          height?: string;
          position?: string;
          rotation?: string;
          transparent?: string;
        },
        HTMLElement
      >;
      "a-assets": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "a-text": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: string;
          position?: string;
          align?: string;
          color?: string;
          scale?: string;
          rotation?: string;
          geometry?: string;
          material?: string;
          shader?: string;
          font?: string;
        },
        HTMLElement
      >;
      "a-plane": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: string;
          rotation?: string;
          width?: string;
          height?: string;
          color?: string;
          opacity?: string;
          shadow?: string;
          material?: string;
        },
        HTMLElement
      >;
      "a-ring": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: string;
          "radius-inner"?: string;
          "radius-outer"?: string;
          color?: string;
          animation?: string;
          visible?: string;
        },
        HTMLElement
      >;
      "a-animation": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          attribute?: string;
          from?: string;
          to?: string;
          begin?: string;
          dur?: string;
          direction?: string;
          repeat?: string;
        },
        HTMLElement
      >;
      "a-sphere": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: string;
          radius?: string;
          color?: string;
        },
        HTMLElement
      >;
      "a-box": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: string;
          width?: string;
          height?: string;
          depth?: string;
          color?: string;
        },
        HTMLElement
      >;
      "a-cylinder": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: string;
          radius?: string;
          height?: string;
          color?: string;
        },
        HTMLElement
      >;
      "a-sky": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          color?: string;
          src?: string;
        },
        HTMLElement
      >;
      "a-light": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          type?: string;
          intensity?: string;
          position?: string;
        },
        HTMLElement
      >;
    }
  }
}
